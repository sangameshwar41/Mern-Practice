import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FormInput from "./FormInput";

describe("FormInput Component", function () {

    it("should display the label", function () {

        render(
            <FormInput
                label="Email"
                type="email"
                name="email"
                value=""
                onChange={function () {}}
            />
        );

        expect(screen.getByText("Email")).toBeInTheDocument();

    });

    it("should display the placeholder", function () {

        render(
            <FormInput
                label="Email"
                type="email"
                name="email"
                value=""
                onChange={function () {}}
                placeholder="Enter email"
            />
        );

        expect(
            screen.getByPlaceholderText("Enter email")
        ).toBeInTheDocument();

    });

    it("should display validation error", function () {

        render(
            <FormInput
                label="Email"
                type="email"
                name="email"
                value=""
                onChange={function () {}}
                error="Email is required"
            />
        );

        expect(
            screen.getByText("Email is required")
        ).toBeInTheDocument();

    });

    it("should call onChange when user types", async function () {

        const handleChange = vi.fn();
        const user = userEvent.setup();

        render(
            <FormInput
                label="Email"
                type="email"
                name="email"
                value=""
                onChange={handleChange}
            />
        );

        const input = screen.getByRole("textbox");

        await user.type(input, "test");

        expect(handleChange).toHaveBeenCalled();

    });

});