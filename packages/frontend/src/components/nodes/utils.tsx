import React from "react";
import { Node, Edge, ReactFlowInstance, XYPosition } from "reactflow";
import type { DownloadJsonItem, DownloadJsonTypes } from "@types";

import { writeClipboard, readClipboard } from "../../lib/clipboard";
// import { roleInfo } from '../../lib/constants'

const findNode = (nodes: Node[], id: string): Node => {
  return nodes.find((node: Node) => node.id === id) as Node;
};

const findEdge = (edges: Edge[], id: string): Edge => {
  return edges.find((edge: Edge) => edge.id === id) as Edge;
};

const findFunctionEdge = (edges: Edge[], id: string): Edge => {
  return edges.find(
    (edge: Edge) => edge.targetHandle?.match(id) || edge.sourceHandle?.match(id)
  ) as Edge;
};

const exsistsNodeHundle = (
  edges: Edge[],
  handleID: string,
  nodeID: string
): boolean => {
  var exists = false;
  for (var i = 0; i < edges.length; i++) {
    if (
      (edges[i].targetHandle == handleID && edges[i].target == nodeID) ||
      (edges[i].sourceHandle == handleID && edges[i].source == nodeID)
    ) {
      exists = true;
      break;
    }
  }
  return exists;
};

const findNodeEdge = (edges: Edge[], id: string): Edge => {
  return edges.find(
    (edge: Edge) => edge.target?.match(id) || edge.source?.match(id)
  ) as Edge;
};

const isConnectableEdge = (params: any, edges: Edge[] ,oldEdge: Edge | null): [boolean,string] => {
  var connectintg = false;
  var errorMsg = "";
  var sourceID = params.sourceHandle ?? "";
  var sourceNodeID = params.source ?? "";
  var targetID = params.targetHandle ?? "";
  var targetNodeID = params.target ?? "";

  // マッピング線付け替えの場合、マッピング線配列から古いマッピング線を除外してチェックする
  var checkEdges =  Array.from(edges);
  if (oldEdge != null) {
    for (var i = 0; i < checkEdges.length; i++) {
      if ( checkEdges[i].sourceHandle == oldEdge.sourceHandle && checkEdges[i].targetHandle == oldEdge.targetHandle) {
        checkEdges.splice(i, 1);
        break;
      }
    }
  }

  if (sourceNodeID == targetNodeID) {
    // 同じIDのノード内では結合不可
    connectintg = false;
    errorMsg = "";
  } else if (
    (sourceNodeID.match("_source") && targetID.match("_function_in_")) ||
    (sourceNodeID.match("_source") && targetNodeID.match("_destination")) ||
    (sourceID.match("_function_out_") && targetNodeID.match("_destination"))
  ) {
    // (変換元・関数のINPUT) or (変換元・変換先) or (関数のOUTPUT・変換先)
    connectintg = true;
    errorMsg = "";
  } else if (
    sourceNodeID.match("_function") &&
    targetNodeID.match("_function")
  ) {
    errorMsg = "関数同士は紐づけできません。";
  }

  // 接続済みチェック(同じHuldleへの接続は基本的にできない)
  if (connectintg) {
    if (exsistsNodeHundle(checkEdges, sourceID, sourceNodeID)) {
      connectintg = false;
      if (sourceNodeID.match("_function")) {
        errorMsg =
          "既にマッピングされている関数のデータ項目には紐づけできないため、関数を複製してください。";
      }
    }
    if (exsistsNodeHundle(checkEdges, targetID, targetNodeID)) {
      connectintg = false;
      if (targetNodeID.match("_destination")) {
        errorMsg =
          "既にマッピングされている変換先データ項目には紐づけできません。";
      } else if (targetNodeID.match("_function")) {
        errorMsg =
          "既にマッピングされている関数のデータ項目には紐づけできません。";
      }
    }
    // 例外として、変換元・変換先接続の場合、1:N接続は許可する
    if (
      sourceNodeID.match("_source") &&
      targetNodeID.match("_destination") &&
      !exsistsNodeHundle(checkEdges, targetID, targetNodeID)
    ) {
      connectintg = true;
      errorMsg = "";
    }
    // 例外として、変換元・関数(変換元データ項目)接続の場合、1:N接続は許可する
    if (
      sourceNodeID.match("_source") &&
      targetNodeID.match("_function") &&
      !exsistsNodeHundle(checkEdges, targetID, targetNodeID)
    ) {
      connectintg = true;
      errorMsg = "";
    }
  }
  // 省略表示されている場合(画面に表示されていない)は接続不可
  var source = document.getElementsByClassName("hidden_source_" + sourceID);
  var target = document.getElementsByClassName("hidden_target_" + targetID);
  if (target.length > 0 || source.length > 0) {
    connectintg = false;
    errorMsg = "関数がアイコン表示されている時は紐づけできません。";
  }
  return [connectintg, errorMsg];
};

const findTargetHundle = (edges: Edge[], id: string): Edge => {
  return edges.find((edge: Edge) => edge.targetHandle?.match(id)) as Edge;
};

const selectedNodesAndEdges = (nodes: Node[], edges: Edge[]) => {
  const selectedNodes = nodes.filter((node) => node.selected);
  const selectedEdges = edges.filter((edge) => {
    const source = findNode(selectedNodes, edge.source);
    const target = findNode(selectedNodes, edge.target);
    return source && target;
  });
  return { selectedNodes, selectedEdges };
};

const cutNodes = (
  nodes: Node[],
  edges: Edge[],
  reactFlowInstance: ReactFlowInstance | null
) => {
  const { selectedNodes, selectedEdges } = selectedNodesAndEdges(nodes, edges);
  const value = JSON.stringify(
    { nodes: selectedNodes, edges: selectedEdges },
    null,
    "  "
  );
  writeClipboard(value);
  reactFlowInstance?.deleteElements({ nodes: selectedNodes });
};

const copyNodes = (nodes: Node[], edges: Edge[]) => {
  const { selectedNodes, selectedEdges } = selectedNodesAndEdges(nodes, edges);
  const value = JSON.stringify(
    { nodes: selectedNodes, edges: selectedEdges },
    null,
    "  "
  );
  writeClipboard(value);
};

const pasteNodes = async (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  incrementNodeId: () => number,
  offset: XYPosition = { x: 0, y: 0 }
) => {
  const value = await readClipboard();
  let newNodes: Node[];
  let newEdges: Edge[];
  try {
    const result = JSON.parse(value);
    newNodes = result.nodes;
    newEdges = result.edges;
  } catch (e) {
    console.log("JSON.parse error", e);
    return;
  }
  if (!Array.isArray(newNodes)) return;

  const nodeMap: { [key: string]: string } = {};
  newNodes = newNodes.map<Node>((node: Node) => {
    if (node.position) {
      node.position.x = node.position.x + offset.x;
      node.position.y = node.position.y + offset.y;
    } else {
      node.position = { x: 0, y: 0 };
    }
    const oldId = node.id;
    node.id = `node_${incrementNodeId()}`;
    nodeMap[oldId] = node.id;
    return node;
  });
  setNodes((nodes) => {
    for (const node of nodes) {
      node.selected = false;
    }
    return nodes.concat(newNodes);
  });

  newEdges = newEdges.map((edge) => {
    edge.source = nodeMap[edge.source];
    edge.target = nodeMap[edge.target];
    edge.id = `reactflow__edge-${edge.source}${edge.sourceHandle}-${edge.target}${edge.targetHandle}`;
    return edge;
  });
  setEdges((edges: Edge[]) => {
    for (const edge of edges) {
      edge.selected = false;
    }
    return edges.concat(newEdges);
  });
};

const deleteNodes = (
  nodes: Node[],
  reactFlowInstance: ReactFlowInstance | null
) => {
  const selectedNodes = nodes.filter((node) => node.selected);
  reactFlowInstance?.deleteElements({ nodes: selectedNodes });
};

const selectNodes = (
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  selected: boolean
) => {
  setNodes((nodes) => {
    for (const node of nodes) {
      node.selected = selected;
    }
    return [...nodes];
  });
};

const selectEdges = (
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  selected: boolean
) => {
  setEdges((edges) => {
    for (const edge of edges) {
      edge.selected = selected;
    }
    return [...edges];
  });
};

const edgeType = (source: string, target: string, nodes: Node[]) => {
  const sourceNode = findNode(nodes, source);
  const targetNode = findNode(nodes, target);
  //console.log('at: edgeType', {source, target, nodes, sourceNode, targetNode})
  if (sourceNode === undefined || targetNode === undefined) return "default"; // default

  const sourceCountry = sourceNode.data.country ?? "";
  const targetCountry = targetNode.data.country ?? "";
  if (sourceCountry === "" || targetCountry === "") return "default"; // default

  return sourceCountry === targetCountry ? "default" : "default";
};

function createConvertRule(nodes, edges) {
  const convertRule: DownloadJsonTypes = {
    convert_rule: [],
  };

  // 関数毎にマッピングルールを作成する
  let functionMap = new Map();
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].type == "functionbody") {
      let functionEdges = {
        target: new Array(),
        source: new Array(),
        function: new Array(),
      };
      functionEdges.function.push("custom");
      functionEdges.function.push(
        nodes[i].data.functionLogic.replaceAll("\n", ";")
      );

      for (var j = 0; j < nodes[i].data.destination.length; j++) {
        let findEdge = findFunctionEdge(edges, nodes[i].data.destination[j].id);
        if (findEdge != undefined) {
          functionEdges.target.push(findEdge.targetHandle);
        }
      }

      for (var j = 0; j < nodes[i].data.source.length; j++) {
        let findEdge = findFunctionEdge(edges, nodes[i].data.source[j].id);
        if (findEdge != undefined) {
          functionEdges.source.push(findEdge.sourceHandle);
        }
      }
      // 変換元、変換先項目が1個以上設定されている場合のみマッピングルールを設定
      if (0 < functionEdges.target.length && 0 < functionEdges.source.length) {
        functionMap.set(nodes[i].id, functionEdges);
      }
    }
  }

  // edgesを関数とそうでないものに分ける
  for (var i = 0; i < edges.length; i++) {
    if (
      edges[i].targetHandle?.match("_function_") ||
      edges[i].sourceHandle?.match("_function_")
    ) {
      // 関数と繋がっているedgesは処理済であるため、対象外
      continue;
    } else {
      // 関数ではないedge
      if (functionMap.get(edges[i].sourceHandle) != undefined) {
        // 同じsourceHandleは纏める（1:n の対応）
        functionMap
          .get(edges[i].sourceHandle)
          .target.push(edges[i].targetHandle);
      } else {
        var edge = {
          target: [edges[i].targetHandle],
          source: [edges[i].sourceHandle],
          function: [],
        };
        functionMap.set(edges[i].sourceHandle, edge);
      }
    }
  }

  // マッピングルール出力
  var i = 0;
  for (const [key, value] of functionMap.entries()) {
    const mappingRule: DownloadJsonItem = {
      source: [],
      destination: [],
      function: [],
    };
    for (var j = 0; j < value.source.length; j++) {
      mappingRule.source.push(value.source[j]);
    }
    for (var j = 0; j < value.target.length; j++) {
      mappingRule.destination.push(value.target[j]);
    }
    for (var j = 0; j < value.function.length; j++) {
      mappingRule.function.push(value.function[j]);
    }
    convertRule.convert_rule.push(mappingRule);
    i++;
  }
  return convertRule;
}

// 読み込んだfileContentsがJSON.parseで有効か判定（文字列をJsonとして解析できるか）
function tryParseJSON(jsonString) {
  try {
    // できた場合resultとして結果を返す
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    return null;
  }
}

/** エラー、警告メッセージ配列 */
var errors = new Object();
var warnings = new Object();
var errorsIdx = 1;
var warningsIdx = 1;

/**
 * オブジェクトの最下層の値の取得
 * @private
 * @param {Object} obj 取得用オブジェクト
 * @param {Array<string>} array "."で分割した配列
 * @param {Object} r リクエストオブジェクト
 * @return {Map<string,string>} retrunMap
 */
function getEndValues(obj, array, r) {
  var deepNum = 0;
  var tempObj = obj;
  var indexMap = {};
  var index = 0;
  var returnMap = {};
  var fullkey = "";

  while (true) {
    var key = array[deepNum];
    key = key.replace(/\[\]$/, "");
    fullkey += key;
    // 末端を登録
    if (deepNum === array.length - 1) {
      if (!(typeof tempObj[key] === "undefined")) {
        returnMap[fullkey] = tempObj[key];
      }
      delNum = fullkey.lastIndexOf("[");
      if (delNum === -1) {
        return returnMap;
      } else {
        fullkey = fullkey.substring(0, delNum);
        index = indexMap[fullkey];
        index++;
        indexMap[fullkey] = index;
      }
      // tempObj他、リセット
      deepNum = 0;
      tempObj = obj;
      fullkey = "";
      continue;
    }

    var isArrayValue = Array.isArray(tempObj[key]);

    // 末端でなければ、一つ階層を落とす
    if (isArrayValue) {
      if (!indexMap.hasOwnProperty(fullkey)) {
        // 最初
        indexMap[fullkey] = 0;
      }
      index = indexMap[fullkey];

      if (index >= tempObj[key].length) {
        var delNum = fullkey.lastIndexOf("[");
        if (delNum === -1) {
          return returnMap;
        } else {
          fullkey = fullkey.substring(0, delNum);
          index = indexMap[fullkey];
          index++;
          indexMap[fullkey] = index;
        }
        // tempObj他、リセット
        deepNum = 0;
        tempObj = obj;
        fullkey = "";
        continue;
      }

      fullkey += "[" + index + "]";

      tempObj = tempObj[key][index];
    } else {
      tempObj = tempObj[key];
    }

    if (typeof tempObj === "undefined") {
      delNum = fullkey.lastIndexOf("[");
      if (delNum === -1) {
        return returnMap;
      } else {
        fullkey = fullkey.substring(0, delNum);
        index = indexMap[fullkey];
        index++;
        indexMap[fullkey] = index;
      }

      // tempObj他、リセット
      deepNum = 0;
      tempObj = obj;
      fullkey = "";
      continue;
    }

    fullkey += ".";
    deepNum++;
  }
}

/**
 * オブジェクトの最下層の値への登録
 * @private
 * @param {Object} obj 登録用オブジェクト
 * @param {Map<string,string>} map 登録用キーMap
 * @param {Object} r リクエストオブジェクト
 */
function setEndValues(obj, map, r) {
  Object.entries(map).forEach(function (entry) {
    var keyArray = entry[0].split(".");
    setEndValue(entry[1], obj, keyArray, r);
  });
}

/**
 * オブジェクトの最下層の値への登録
 * @private
 * @param {string} value セットする値
 * @param {Object} obj 登録用オブジェクト
 * @param {Array<string>} array "."で分割した配列
 * @param {Object} r リクエストオブジェクト
 */
function setEndValue(value, obj, array, r) {
  if (typeof value === "undefined") {
    return;
  }
  var deepNum = 0;
  var nextKey;
  var nextKeySize;
  var nextKeyArray;
  var nextKeyArrayStr;
  var isArrayNextKey;
  var match = /([^[]*)\[([0-9]+)\]$/;

  while (deepNum < array.length - 1) {
    nextKey = array[deepNum];
    isArrayNextKey = nextKey.match(match);
    if (isArrayNextKey) {
      nextKeyArrayStr = nextKey.replace(match, function (str, p1, p2) {
        var obj = { nextKey: p1, nextKeySize: parseInt(p2) };
        return JSON.stringify(obj);
      });
      nextKeyArray = JSON.parse(nextKeyArrayStr);
      nextKey = nextKeyArray["nextKey"];
      nextKeySize = nextKeyArray["nextKeySize"];
    }

    if (typeof obj[nextKey] === "undefined") {
      // 現在のeditJSONに存在しないなら新規作成
      if (isArrayNextKey) {
        obj[nextKey] = [];
      } else {
        obj[nextKey] = {};
      }
    }

    // 配列分作成
    if (isArrayNextKey) {
      for (var i = 0; i < nextKeySize + 1; i++) {
        if (typeof obj[nextKey][i] === "undefined") {
          obj[nextKey][i] = {};
        }
      }
    }

    // 階層を一つ進める
    if (isArrayNextKey) {
      obj = obj[nextKey][nextKeySize];
    } else {
      obj = obj[nextKey];
    }
    deepNum++;
  }
  // 現在の階層へ値を登録.
  nextKey = array[deepNum];
  isArrayNextKey = nextKey.match(match);
  if (isArrayNextKey) {
    nextKeyArrayStr = nextKey.replace(match, function (str, p1, p2) {
      var obj = { nextKey: p1, nextKeySize: parseInt(p2) };
      return JSON.stringify(obj);
    });
    nextKeyArray = JSON.parse(nextKeyArrayStr);
    nextKey = nextKeyArray["nextKey"];
    nextKeySize = nextKeyArray["nextKeySize"];
  }

  if (isArrayNextKey) {
    obj[nextKey][nextKeySize] = value;
  } else {
    obj[nextKey] = value;
  }

  return;
}

/**
 * URI変換
 * @private
 * @param {number} rpFlg
 * @param {Map<string,string>} map URI変換前キーMap
 * @param {string} extrUri 抽出URI
 * @param {string} replUri 置換URI
 * @param {Object} r リクエストオブジェクト
 */
function convertUri(rpFlg, map, extrUri, replUri, r) {
  var mapUri = Object.keys(map)[0];

  if (typeof mapUri === "undefined") {
    outWarningLog(
      "データマッピングルールにある" +
        extrUri +
        "に該当するデータ項目は存在しないため変換しません。"
    );
    return;
  }

  extrUri = extrUri.replace(/\[\]$/, "");
  replUri = replUri.replace(/\[\]$/, "");
  var arrayExtrUri = extrUri.split(/\[\]./);
  var arrayReplUri = replUri.split(/\[\]./);
  var arraymapUri = mapUri.split(/\[[0-9]*\]./);

  if (
    arrayExtrUri.length === arrayReplUri.length &&
    arrayReplUri.length === arraymapUri.length
  ) {
    // 同じ場合置換
    Object.entries(map).forEach(function (p) {
      // entry = [key , value]
      var p_value = p[1];
      var p_key = p[0];
      delete map[p_key];

      var new_key = p[0];
      Object.keys(arrayExtrUri).forEach(function (index) {
        new_key = new_key.replace(arrayExtrUri[index], arrayReplUri[index]);
      });

      map[new_key] = p_value;
    });
  } else {
    // 抽出の方が大きい場合
    // 置換の方が大きい場合
    outWarningLog(
      "JSON変換ルールに配列の個数誤りがあるため変換できません。[" +
        replUri +
        "],[" +
        extrUri +
        "]"
    );
    Object.entries(map).forEach(function (p) {
      delete map[p[0]];
    });
  }
}

/**
 * マッピング変換処理
 * @private
 * @param {Object} obj
 * @param {Array<Object>} json_convert_mappings
 * @param {number} rpFlg
 * @param {number} r
 * @return {Object} edit_obj
 */
function mappingConversion(obj, json_convert_mappings, rpFlg, r) {
  errors = new Object();
  warnings = new Object();
  errorsIdx = 1;
  warningsIdx = 1;

  var edit_obj = {};

  for (var i = 0; i < json_convert_mappings.length; i++) {
    var mapping = json_convert_mappings[i];

    // 「source」または「destination」が存在しない場合、マッピングエラー
    if (
      typeof mapping.source === "undefined" ||
      typeof mapping.destination === "undefined" ||
      mapping.source.length == 0 ||
      mapping.destination.length == 0
    ) {
      outErrorLog("Mapping is missing a required parameter");
    }

    // カスタム関数(m:n)が指定された場合
    if (
      0 < mapping.source.length &&
      0 < mapping.destination.length &&
      0 < mapping.function.length &&
      mapping.function[0] === "custom"
    ) {
      customFunction(rpFlg, obj, edit_obj, mapping, r);
    } else if (mapping.source.length == 1 && mapping.destination.length == 1) {
      // 1:1マッピング
      mappingExecution(
        rpFlg,
        obj,
        edit_obj,
        mapping.source[0],
        mapping.destination[0],
        r
      );
    } else if (mapping.source.length == 1 && 1 < mapping.destination.length) {
      // 1:nマッピング
      if (mapping.function.length == 0) {
        // 関数なし
        for (var j = 0; j < mapping.destination.length; j++) {
          mappingExecution(
            rpFlg,
            obj,
            edit_obj,
            mapping.source[0],
            mapping.destination[j],
            r
          );
        }
      } else {
        // 関数あり
        switch (mapping.function[0]) {
          case "SPLIT":
            split(rpFlg, obj, edit_obj, mapping, r);
            break;
          default:
            // マッピング処理なし（エラー）
            outErrorLog("The specified function does not exist");
        }
      }
    } else if (1 < mapping.source.length && mapping.destination.length == 1) {
      // n:1マッピング
      if (mapping.function.length == 0) {
        // 関数なし（エラー）
        outErrorLog("No function specified");
      } else {
        // 関数あり
        switch (mapping.function[0]) {
          case "CONCAT":
            concat(rpFlg, obj, edit_obj, mapping, r);
            break;
          default:
            // マッピング処理なし（エラー）
            outErrorLog("The specified function does not exist");
        }
      }
    } else if (1 < mapping.source.length && 1 < mapping.destination.length) {
      // n:mマッピング
      if (mapping.function.length == 0) {
        // 関数なし（エラー）
        outErrorLog("No function specified");
      } else {
        // 関数あり
        switch (mapping.function[0]) {
          default:
            // マッピング処理なし（エラー）
            outErrorLog("The specified function does not exist");
        }
      }
    }
  }

  // 結果JSONファイル作成
  let resultJson = new Object({
    errors,
    warnings,
    data: [edit_obj],
  });

  return resultJson;
}

/**
 * SPLIT関数(1:nマッピング)
 *
 * @param {number} rpFlg
 * @param {Object} obj
 * @param {Object} edit_obj
 * @param {Array<Object>} mapping
 * @param {Object} r
 */
function split(rpFlg, obj, edit_obj, mapping, r) {
  // 区切り文字
  var delim = mapping.function[1];
  if (delim === undefined) {
    outErrorLog("Mapping is missing a required parameter");
  }
  var listSource = mapping.source[0].split(".");
  var sorceArray = getEndValue(obj, listSource).split(delim);

  let tempObj = new Object();
  for (var i = 0; i < mapping.destination.length; i++) {
    var key = "key" + i;
    if (i < sorceArray.length) {
      tempObj[key] = sorceArray[i];
    } else {
      tempObj[key] = "";
    }
    mappingExecution(rpFlg, tempObj, edit_obj, key, mapping.destination[i], r);
  }
}

/**
 * CONCAT関数(n:1マッピング)
 *
 * @param {number} rpFlg
 * @param {Object} obj
 * @param {Object} edit_obj
 * @param {Array<Object>} mapping
 * @param {Object} r
 */
function concat(rpFlg, obj, edit_obj, mapping, r) {
  // n個のデータを結合
  var concatStr = "";
  for (var j = 0; j < mapping.source.length; j++) {
    var sourceData = "";
    var listSource = mapping.source[j].split(".");
    var endValue = getEndValue(obj, listSource);
    if (endValue !== undefined) {
      sourceData = endValue;
      concatStr = concatStr + sourceData;
    } else {
      outWarningLog(
        "データマッピングルールにある" +
          mapping.source[j] +
          "に該当するデータ項目は存在しないため変換しません。"
      );
    }
  }
  // 入力データが無い場合、マッピングせずに終了する
  if (concatStr === "") {
    return;
  }

  let tempObj = new Object();
  var key = "key";
  tempObj[key] = concatStr;
  mappingExecution(rpFlg, tempObj, edit_obj, key, mapping.destination[0], r);
}

/**
 * カスタム関数(n:mマッピング)
 *
 * @param {number} rpFlg
 * @param {Object} obj
 * @param {Object} edit_obj
 * @param {Array<Object>} mapping
 * @param {Object} r
 */
function customFunction(rpFlg, obj, edit_obj, mapping, r) {
  // 変換前データ配列(src)
  let s = new Array();
  for (var i = 0; i < mapping.source.length; i++) {
    var listSource = mapping.source[i].split(".");
    var endValue = getEndValue(obj, listSource);
    if (endValue != undefined) {
      s.push(endValue);
    } else {
      outWarningLog(
        "データマッピングルールにある" +
          mapping.source[i] +
          "に該当するデータ項目は存在しないため変換しません。"
      );
      return;
    }
  }

  // ユーザのコード指定実行により、変換後データ配列(dst)を作成
  var d = new Array();
  try {
    let code = mapping.function[1] + "; return dst";
    let codeFunction = new Function("src", "dst", code);
    d = codeFunction(s, d);
  } catch (e) {
    console.log(e);
    outErrorLog(
      mapping.source[0] +
        "は関数ロジックに構文エラーがあるため、変換できません。"
    );
    return;
  }

  // 関数実行後の配列数チェック
  if (mapping.destination.length != d.length) {
    outWarningLog(
      mapping.source[0] +
        "は関数が成立しないため変換しません。" +
        mapping.destination.length +
        d.length
    );
    return;
  }

  let tempObj = new Object();
  for (var i = 0; i < mapping.destination.length; i++) {
    var key = "key" + i;
    tempObj[key] = d[i];
    mappingExecution(rpFlg, tempObj, edit_obj, key, mapping.destination[i], r);
  }
}

/**
 * マッピングエラー関数
 *
 * @param {number} rpFlg
 * @param {Object} errMsg
 * @param {Object} r
 */
function outErrorLog(errMsg) {
  errors["message" + warningsIdx.toString().padStart(4, "0")] = errMsg;
  errorsIdx++;
}

/**
 * マッピングエラー関数
 *
 * @param {number} rpFlg
 * @param {Object} errMsg
 * @param {Object} r
 */
function outWarningLog(warningMsg) {
  warnings["message" + warningsIdx.toString().padStart(4, "0")] = warningMsg;
  warningsIdx++;
}

/**
 * マッピング実行処理
 * @param {number} rpFlg
 * @param {Object} obj
 * @param {Object} edit_obj
 * @param {Object} source
 * @param {Object} destination
 * @param {Object} r
 */

function mappingExecution(rpFlg, obj, edit_obj, source, destination, r) {
  var array_source = source.split(".");
  var map = getEndValues(obj, array_source, r);
  convertUri(rpFlg, map, source, destination, r);
  setEndValues(edit_obj, map, r);
}

/**
 * オブジェクトの最下層の値の取得
 * @private
 * @param {Object} obj 取得用オブジェクト
 * @param {Array<string>} array "."で分割した配列
 * @return {Object} obj
 */
function getEndValue(obj, array) {
  var deepNum = 0;
  while (deepNum < array.length) {
    if (typeof obj[array[deepNum]] === "undefined") {
      // 存在しないKeyは取得しない
      return;
    } else {
      // 階層を一つ進める
      obj = obj[array[deepNum]];
    }
    deepNum++;
  }
  // 現在の階層の値をreturn
  return obj;
}

// マッピング再計算するためスクロールを発火
function mappingUpdate(nodes: Node[] | null) {
  const elem1 = document.getElementById('srcwrapper')
  const elem2 = document.getElementById('dstwrapper')
  // イベント発火を遅らせて再描画後にupdateNodesを動かす
  if (elem1 !== null) {
    const triggerEvent = new Event('scroll')
    setTimeout(() => { elem1.dispatchEvent(triggerEvent) }, 1);
  }
  if (elem2 !== null) {
    const triggerEvent = new Event('scroll')
    setTimeout(() => { elem2.dispatchEvent(triggerEvent) }, 1);
  }

  if (nodes != null) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.type != undefined && node.type.indexOf("functionbody") > -1) {
  
        const func1 = document.getElementById(node.id + '_funwrapper')
        const func2 = document.getElementById(node.id + '_funsrcwrapper')
        const func3 = document.getElementById(node.id + '_fundstwrapper')
        if (func1 !== null) {
          const triggerEvent = new Event('scroll')
          setTimeout(() => { func1.dispatchEvent(triggerEvent) }, 1);
        }
        if (func2 !== null) {
          const triggerEvent = new Event('scroll')
          setTimeout(() => { func2.dispatchEvent(triggerEvent) }, 1);
        }
        if (func3 !== null) {
          const triggerEvent = new Event('scroll')
          setTimeout(() => { func3.dispatchEvent(triggerEvent) }, 1);
        }
      }
    }
  }
}

export {
  findNode,
  findEdge,
  copyNodes,
  cutNodes,
  pasteNodes,
  deleteNodes,
  selectNodes,
  selectEdges,
  edgeType,
  findFunctionEdge,
  findTargetHundle,
  findNodeEdge,
  exsistsNodeHundle,
  isConnectableEdge,
  createConvertRule,
  tryParseJSON,
  mappingConversion,
  mappingUpdate,
};
