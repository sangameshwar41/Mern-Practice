import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "./Button";

describe("Button Component", function () {

    it("should display the button name", function () {

        render(<Button buttonName="Add Student" />);

        const button = screen.getByRole("button", {
            name: "Add Student"
        });

        expect(button).toBeInTheDocument();

    });
    it("should have button type", function () {

    render(<Button buttonName="Add Student" />);

    const button = screen.getByRole("button", {
        name: "Add Student"
    });

    expect(button).toHaveAttribute("type", "button");

});

});