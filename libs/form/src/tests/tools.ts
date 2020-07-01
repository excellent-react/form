import { RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const submit = async (form: RenderResult) => {
  await sleep(100);
  userEvent.click(form.getByLabelText('submit'));
}