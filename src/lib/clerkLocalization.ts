import { ptBR } from '@clerk/localizations';

/**
 * O pacote oficial `ptBR` do Clerk tem lacunas reais (chaves ausentes caem
 * pro inglês). A maioria são de recursos que este app não usa (SSO
 * empresarial, cobrança por assento, sincronização de diretório) — não
 * vale a pena traduzir tela que nunca aparece. Isso aqui cobre só o que
 * é alcançável no fluxo normal de cadastro/login/e-mail+senha+Google.
 */
export const clerkLocalizationPtBR = {
  ...ptBR,
  formFieldInputPlaceholder__signUpPassword: 'Crie uma senha',
  unstable__errors: {
    ...ptBR.unstable__errors,
    form_password_matches_identifier:
      'A senha não pode ser igual ao seu e-mail, telefone ou usuário. Por segurança, use uma senha diferente.',
    oauth_access_denied: 'Você não concedeu acesso à sua conta.',
    ticket_expired_code: 'Este link expirou. Comece de novo ou peça um link novo.',
    ticket_invalid_code: 'Este link não é mais válido ou já foi usado. Comece de novo ou peça um link novo.',
  },
};
