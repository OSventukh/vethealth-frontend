import { signIn } from 'next-auth/react';
import { ERROR_MESSAGE } from '@/utils/constants/messages';
import { SERVER_ERROR } from '@/utils/constants/server-error-responses';
import logger from '@/logger';

type ReturnedData = {
  error: boolean;
  success: boolean;
  message: string;
  redirect?: string;
};

export async function loginAction(
  state: ReturnedData,
  data: FormData
): Promise<ReturnedData> {
  try {
    const response = await signIn('credentials', {
      email: data.get('email') as string,
      password: data.get('password') as string,
      redirect: false,
    });
    return {
      success: true,
      error: false,
      message: 'Success',
    };
  } catch (error: unknown) {
    let message = 'Щось пішло не так';
    logger.error(
      error instanceof Error ? error.message : JSON.stringify(error)
    );
    if (error instanceof Error) {
      message = error.message;
      if (error.message.includes(SERVER_ERROR.TITLE_MUST_BE_UNIQUE)) {
        message = ERROR_MESSAGE.TITLE_MUST_BE_UNIQUE;
      } else if (
        error.message.includes(SERVER_ERROR.TITLE_SHOULD_BE_NOT_EMPTY)
      ) {
        message = ERROR_MESSAGE.TITLE_SHOULD_BE_NOT_EMPTY;
      } else if (error.message.includes(SERVER_ERROR.SLUG_SHOULD_BE_UNIQUE)) {
        message = ERROR_MESSAGE.SLUG_SHOULD_BE_UNIQUE;
      }
    }

    return {
      error: true,
      success: false,
      message,
    };
  }
}
