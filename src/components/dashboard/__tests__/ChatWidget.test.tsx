import React from "react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn();
    
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
  });

  it("should render null when userProfile is null", () => {
    vi.mocked(useEcoStore).mockReturnValue({
      userProfile: null,
    });

    const { container } = render(<ChatWidget />);
    expect(container.firstChild).toBeNull();
  });

  it("should open and close the chat drawer using button and Escape key", () => {
    render(<ChatWidget />);

    const openButton = screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" });
    fireEvent.click(openButton);

    const headerTitle = screen.getByText("AI Climate Coach");
    expect(headerTitle).toBeDefined();

    // Close via escape key
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByText("AI Climate Coach")).toBeNull();

    // Open again and close via close button
    fireEvent.click(openButton);
    expect(screen.getByText("AI Climate Coach")).toBeDefined();
    const closeButton = screen.getByRole("button", { name: "Close chat" });
    fireEvent.click(closeButton);
    expect(screen.queryByText("AI Climate Coach")).toBeNull();
  });

  it("should send a message and receive a response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "Hello from AI" })
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" }));

    const input = screen.getByPlaceholderText("Ask climate coach or log habit...");
    const sendButton = screen.getByRole("button", { name: "Send message" });

    // Try to send empty message (should do nothing)
    fireEvent.click(sendButton);
    expect(global.fetch).not.toHaveBeenCalled();

    // Type a message
    fireEvent.change(input, { target: { value: "I biked today" } });
    
    // Test pressing form submit
    fireEvent.submit(screen.getByRole("button", { name: "Send message" }));

    // Wait for the message to be added to UI
    await waitFor(() => {
      expect(screen.getByText("I biked today")).toBeDefined();
    });

    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText("Hello from AI")).toBeDefined();
    });
    
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should send a message using quick chips", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "AI Response to chip" })
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" }));

    const chipButton = screen.getByText("I biked 10 km instead of driving today!");
    fireEvent.click(chipButton);

    await waitFor(() => {
      expect(screen.getByText("I biked 10 km instead of driving today!")).toBeDefined();
    });

    await waitFor(() => {
      expect(screen.getByText("AI Response to chip")).toBeDefined();
    });
  });

  it("should handle API error when sending message", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("Network Error"));

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" }));

    const input = screen.getByPlaceholderText("Ask climate coach or log habit...");
    const sendButton = screen.getByRole("button", { name: "Send message" });

    fireEvent.change(input, { target: { value: "Test error" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Network Error")).toBeDefined();
    });
  });

  it("should handle API non-200 responses", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
      status: 429
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" }));

    const input = screen.getByPlaceholderText("Ask climate coach or log habit...");
    fireEvent.change(input, { target: { value: "Test 429" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(screen.getByText("Chat failed with status 429")).toBeDefined();
    });
  });

  it("should handle missing reply field in API response", async () => {
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ error: "Some weird error" }) // Missing reply
    });

    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" }));

    const input = screen.getByPlaceholderText("Ask climate coach or log habit...");
    fireEvent.change(input, { target: { value: "Test bad response" } });
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => {
      expect(screen.getByText("No response reply received from assistant")).toBeDefined();
    });
  });

  it("should clear the chat history", () => {
    // Mock window.confirm
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    
    render(<ChatWidget />);
    fireEvent.click(screen.getByRole("button", { name: "Open AI Climate Coach Chatbot" }));

    const clearButton = screen.getByRole("button", { name: "Clear chat logs" });
    fireEvent.click(clearButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(screen.getByText(/Chat cleared! Let's start fresh/i)).toBeDefined();

    confirmSpy.mockRestore();
  });
});
