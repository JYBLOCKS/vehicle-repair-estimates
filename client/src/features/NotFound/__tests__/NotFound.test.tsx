import { render, screen } from "../../../utils/test-utils";
import NotFound from "../";
import { describe, test, expect } from "vitest";

describe("Not Found Page", () => {
  test("renders the not found page", () => {
    render(<NotFound />);
    const notFoundElement = screen.getByText("404");
    expect(notFoundElement).toBeDefined();
  });
});
