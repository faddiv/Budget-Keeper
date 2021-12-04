export function toErrorMessage(error: any) {
  if (!error) {
    return "<null error>";
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return `${error}`;
}

export function toError(error: any) {
    if (!error) {
      return new Error("<null error>");
    }
    if (error instanceof Error) {
      return error;
    }
    if (typeof error === "string") {
      return new Error(error);
    }
    return new Error(`${error}`);
  }
