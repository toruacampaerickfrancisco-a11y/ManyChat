const { SYSTEM_PROMPT } = require('../config/constants');

function buildAgentSystemPrompt(dynamicContext = '') {
  let prompt = SYSTEM_PROMPT;

  if (dynamicContext) {
    prompt += `\n\n--- CONTEXTO ADICIONAL / REGLAS ACTIVAS ---\n${dynamicContext}`;
  }

  return prompt;
}

module.exports = {
  buildAgentSystemPrompt
};
