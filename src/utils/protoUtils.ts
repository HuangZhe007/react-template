import AElf from './aelf';
import * as protobuf from '@aelfqueen/protobufjs/light';
import coreDescriptor from 'constants/proto/core.json';

const { transform } = AElf.utils;
const pbUtils = AElf.pbUtils;

export const coreRootProto = protobuf.Root.fromJSON(coreDescriptor);

export function encodeProtoMapToBase64(inputType: any, params: any) {
  let input = AElf.utils.transform.transformMapToArray(inputType, params);
  input = AElf.utils.transform.transform(inputType, input, AElf.utils.transform.INPUT_TRANSFORMERS);
  const message = inputType.fromObject(input);
  return Buffer.from(inputType.encode(message).finish()).toString('base64');
}

export function decodeProtoBase64ToMap(inputType: any, base64Str: string) {
  let deserialize = inputType.decode(Buffer.from(base64Str, 'base64'));
  deserialize = inputType.toObject(deserialize, {
    enums: String, // enums as string names
    longs: String, // longs as strings (requires long.js)
    bytes: String, // bytes as base64 encoded strings
    defaults: true, // includes default values
    arrays: true, // populates empty arrays (repeated fields) even if defaults=false
    objects: true, // populates empty objects (map fields) even if defaults=false
    oneofs: true, // includes virtual oneof fields set to the present field's name
  });
  let deserializeLogResult = transform.transform(inputType, deserialize, transform.OUTPUT_TRANSFORMERS);
  deserializeLogResult = transform.transformArrayToMap(inputType, deserializeLogResult);
  return deserializeLogResult;
}

export const getEventLog = (base64Str: string, type = 'Swap') => {
  const dataType = coreRootProto.get(type);
  return decodeProtoBase64ToMap(dataType, base64Str);
};

export const getLog = (Logs: any = [], types: string[] | string) => {
  if (!Array.isArray(Logs) || Logs.length === 0) return [];
  const logMap: any = {};
  Logs.forEach((log) => {
    logMap[log.Name] = log;
  });
  if (typeof types === 'string') {
    const log = logMap[types];
    return { [types]: getEventLog(pbUtils.getSerializedDataFromLog(log), types) };
  }
  if (Array.isArray(types)) {
    const logs: any = {};
    types.forEach((type) => {
      const log = logMap[type];
      logs[type] = getEventLog(pbUtils.getSerializedDataFromLog(log), type);
    });
    return logs;
  }
};
