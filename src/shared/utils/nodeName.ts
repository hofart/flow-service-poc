import { PREVIEW_FLOW } from 'shared/models/service-flow.interface';

export const nodeName = (props: any) => {
  if (props.data.name) {
    return props.data.name;
  }

  const labelList: Record<string, string> = {
    [PREVIEW_FLOW.INIT_ATTENDANCE]: 'Início do atendimento',
    [PREVIEW_FLOW.TERMS_OF_USE]: 'Termos de uso',
    [PREVIEW_FLOW.CONSENT]: 'Consentimentos',
    [PREVIEW_FLOW.SIGNATURE]: 'Assinatura',
  };

  const iconList: Record<string, string> = {
    [PREVIEW_FLOW.INIT_ATTENDANCE]: 'home',
    [PREVIEW_FLOW.TERMS_OF_USE]: 'file-graph',
    [PREVIEW_FLOW.CONSENT]: 'clipboard-notes',
    [PREVIEW_FLOW.SIGNATURE]: 'pen',
  };

  const label = labelList[props.data.key];

  const icon = iconList[props.data.key];

  const key = props.data.key;

  return {
    label,
    icon,
    key,
  };
};
