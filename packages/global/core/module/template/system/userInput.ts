import {
  FlowNodeInputTypeEnum,
  FlowNodeOutputTypeEnum,
  FlowNodeTypeEnum
} from '../../node/constant';
import { FlowModuleTemplateType } from '../../type.d';
import {
  ModuleIOValueTypeEnum,
  ModuleInputKeyEnum,
  ModuleOutputKeyEnum,
  ModuleTemplateTypeEnum
} from '../../constants';

export const UserInputModule: FlowModuleTemplateType = {
  id: FlowNodeTypeEnum.questionInput,
  templateType: ModuleTemplateTypeEnum.systemInput,
  flowType: FlowNodeTypeEnum.questionInput,
  avatar: '/imgs/module/userChatInput.svg',
  name: '对话入口',
  intro: '当用户发送一个内容后，流程将会从这个模块开始执行。',
  inputs: [
    {
      key: ModuleInputKeyEnum.userChatInput,
      type: FlowNodeInputTypeEnum.systemInput,
      valueType: ModuleIOValueTypeEnum.string,
      label: 'core.module.input.label.user question',
      showTargetInApp: false,
      showTargetInPlugin: false
    }
  ],
  outputs: [
    {
      key: ModuleOutputKeyEnum.userChatInput,
      label: 'core.module.input.label.user question',
      type: FlowNodeOutputTypeEnum.source,
      valueType: ModuleIOValueTypeEnum.string,
      targets: []
    }
  ]
};
