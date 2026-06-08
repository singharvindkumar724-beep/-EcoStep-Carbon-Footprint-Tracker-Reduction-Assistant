import React from "react";
import { vi, describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatWidget from "../ChatWidget";
import { useEcoStore } from "@/store/useEcoStore";

// Mock Zustand store state
vi.mock("@/store/useEcoStore", () => {
  return {
    useEcoStore: vi.fn(),
  };
});

// Mock JSDOM missing HTMLElement scrollIntoView function
if (typeof window !== "undefined") {
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
}

describe("ChatWidget Component", () => {
  it("should render null when userProfile is null", () => {
    vi.mocked(useEcoStore).mockReturnValue({
      userProfile: null,
    });

    const { container } = render(<ChatWidget />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the floating chat button when userProfile is present", () => {
    vi.mocked(useEcoStore).mockReturnValue({
      userProfile: {
        location: "US",
        householdSize: 2,
        dietType: "omnivore",
        vehicleType: "petrol_car",
        carDistanceWeekly: 100,
        flightShortDuration: 2,
        flightLongDuration: 0,
        electricitySource: "grid_electricity",
        heatingSource: "natural_gas",
        shoppingHabits: "average",
      },
    });

    render(<ChatWidget />);

    // Check that button is rendered
    const button = screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" });
    expect(button).toBeDefined();

    // Click the button to toggle chat drawer
    fireEvent.click(button);

    // Verify chat drawer title
    const headerTitle = screen.getByText("AI Climate Coach");
    expect(headerTitle).toBeDefined();

    // Verify input box is rendered
    const input = screen.getByPlaceholderText("Ask climate coach or log habit...");
    expect(input).toBeDefined();
  });
});
