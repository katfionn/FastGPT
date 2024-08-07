import type { ChatItemType } from '@fastgpt/global/core/chat/type.d';
import type { ModuleDispatchProps } from '@fastgpt/global/core/module/type.d';
import { ModuleInputKeyEnum, ModuleOutputKeyEnum } from '@fastgpt/global/core/module/constants';
import { DispatchNodeResponseKeyEnum } from '@fastgpt/global/core/module/runtime/constants';
import { ModelTypeEnum, getLLMModel } from '@fastgpt/service/core/ai/model';
import { formatModelChars2Points } from '@fastgpt/service/support/wallet/usage/utils';
import { queryExtension } from '@fastgpt/service/core/ai/functions/queryExtension';
import { getHistories } from '../utils';
import { hashStr } from '@fastgpt/global/common/string/tools';
import { DispatchNodeResultType } from '@fastgpt/global/core/module/runtime/type';

type Props = ModuleDispatchProps<{
  [ModuleInputKeyEnum.aiModel]: string;
  [ModuleInputKeyEnum.aiSystemPrompt]?: string;
  [ModuleInputKeyEnum.history]?: ChatItemType[] | number;
  [ModuleInputKeyEnum.userChatInput]: string;
}>;
type Response = DispatchNodeResultType<{
  [ModuleOutputKeyEnum.text]: string;
}>;

export const dispatchQueryExtension = async ({
  histories,
  module,
  params: { model, systemPrompt, history, userChatInput }
}: Props): Promise<Response> => {
  if (!userChatInput) {
    return Promise.reject('Question is empty');
  }

  const queryExtensionModel = getLLMModel(model);
  const chatHistories = getHistories(history, histories);

  const { extensionQueries, tokens } = await queryExtension({
    chatBg: systemPrompt,
    query: userChatInput,
    histories: chatHistories,
    model: queryExtensionModel.model
  });

  extensionQueries.unshift(userChatInput);

  const { totalPoints, modelName } = formatModelChars2Points({
    model: queryExtensionModel.model,
    tokens,
    modelType: ModelTypeEnum.llm
  });

  const set = new Set<string>();
  const filterSameQueries = extensionQueries.filter((item) => {
    // 删除所有的标点符号与空格等，只对文本进行比较
    const str = hashStr(item.replace(/[^\p{L}\p{N}]/gu, ''));
    if (set.has(str)) return false;
    set.add(str);
    return true;
  });

  return {
    [DispatchNodeResponseKeyEnum.nodeResponse]: {
      totalPoints,
      model: modelName,
      tokens,
      query: userChatInput,
      textOutput: JSON.stringify(filterSameQueries)
    },
    [DispatchNodeResponseKeyEnum.nodeDispatchUsages]: [
      {
        moduleName: module.name,
        totalPoints,
        model: modelName,
        tokens
      }
    ],
    [ModuleOutputKeyEnum.text]: JSON.stringify(filterSameQueries)
  };
};
