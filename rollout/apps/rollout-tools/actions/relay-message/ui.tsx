import React from 'react';

import { defineUIComponent, RichTextInput } from '@rollout/framework/ui';

import type { inputParamsSchema } from './input';

export const UI = defineUIComponent<typeof inputParamsSchema>((props) => {
  const { b } = props;

  return (
    <>
      <RichTextInput bind={b.to} />
      <RichTextInput bind={b.from} />
      <RichTextInput bind={b.message} />
    </>
  );
});
