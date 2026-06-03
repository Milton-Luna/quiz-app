import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnswerButton } from "~/components";

// ─── AnswerButton ─────────────────────────────────────────────────────────────

describe("AnswerButton", () => {
  const BASE_PROPS = {
    id: "A" as const,
    text: "Francia",
    isSelected: false,
    isCorrect: false,
    isAnswered: false,
    onClick: vi.fn(),
  };

  it("estado idle: muestra la letra y el texto de la opción", () => {
    render(<AnswerButton {...BASE_PROPS} />);

    expect(screen.getByText("Francia")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    // No debe estar deshabilitado en estado idle
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("interactividad: llama a onClick al hacer clic en estado idle", () => {
    const onClick = vi.fn();
    render(<AnswerButton {...BASE_PROPS} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("estado deshabilitado: no llama a onClick cuando isAnswered es true", () => {
    const onClick = vi.fn();
    render(
      <AnswerButton {...BASE_PROPS} isAnswered={true} onClick={onClick} />
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("estado correcto: muestra ícono ✓ cuando la respuesta seleccionada es correcta", () => {
    render(
      <AnswerButton
        {...BASE_PROPS}
        isSelected={true}
        isCorrect={true}
        isAnswered={true}
      />
    );

    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("estado incorrecto: muestra ícono ✗ cuando la respuesta seleccionada es incorrecta", () => {
    render(
      <AnswerButton
        {...BASE_PROPS}
        isSelected={true}
        isCorrect={false}
        isAnswered={true}
      />
    );

    expect(screen.getByText("✗")).toBeInTheDocument();
  });
});
