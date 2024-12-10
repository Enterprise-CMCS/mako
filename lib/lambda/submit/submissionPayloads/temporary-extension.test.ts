import { describe, it, expect, vi, beforeEach } from "vitest";
import { temporaryExtension } from "./temporary-extension";
import { isAuthorized, getAuthDetails, lookupUserAttributes } from "libs/api/auth/user";
import { itemExists } from "libs/api/package";
import { type APIGatewayEvent } from "aws-lambda";

// Mock AppK Payload
const mockAppKPayload = {
  id: "SS-1234.R11.TE12",
  event: "temporary-extension",
  authority: "1915(b)",
  proposedEffectiveDate: 1700000000,
  title: "Sample Title for Appendix K",
  attachments: {
    waiverExtensionRequest: {
      label: "RAI Response Letter",
      files: [
        {
          filename: "appendix-k-amendment.docx",
          title: "Appendix K Waiver Amendment",
          bucket: "mako-outbox-attachments-635052997545",
          key: "8b56f7ab-e1ad-4782-87f4-d43ab9d2f5d7.docx",
          uploadDate: Date.now(),
        },
      ],
    },

    other: {
        files: [
            {
              filename: "misc-documents.pdf",
              title: "Additional Supporting Documents",
              bucket: "mako-outbox-attachments-635052997545",
              key: "c22aa4dc-e1b6-41d5-bf64-e45b6f74f5af.pdf",
              uploadDate: Date.now(),
            },
          ],
          label: "Other",
    },
  },
  additionalInformation: "Some additional information about this submission.",
  waiverNumber:'SS-1111.R11.00'

};

vi.mock("libs/api/auth/user", () => ({
  isAuthorized: vi.fn(),
  getAuthDetails: vi.fn(),
  lookupUserAttributes: vi.fn(),
}));

vi.mock("libs/api/package", () => ({
  itemExists: vi.fn(),
}));

describe("appK function", () => {
  const mockIsAuthorized = vi.mocked(isAuthorized);
  const mockGetAuthDetails = vi.mocked(getAuthDetails);
  const mockLookupUserAttributes = vi.mocked(lookupUserAttributes);
  const mockItemExists = vi.mocked(itemExists)

  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should be unauthorized", async () => {
    mockIsAuthorized.mockResolvedValueOnce(false);

    mockLookupUserAttributes.mockResolvedValueOnce({
        email: "john.doe@example.com",
        given_name: "John",
        family_name: "Doe",
        sub: "",
        "custom:cms-roles": "",
        email_verified: false,
        username: ""
    });


    // Mock API Gateway Event
    const mockEvent = {
        body: JSON.stringify(mockAppKPayload),
    } as APIGatewayEvent;

    await expect(temporaryExtension(mockEvent)).rejects.toThrow("Unauthorized");

  });
  it("should have no body on submission and throw an error", async () => {
    mockIsAuthorized.mockResolvedValueOnce(true);

    mockLookupUserAttributes.mockResolvedValueOnce({
        email: "john.doe@example.com",
        given_name: "John",
        family_name: "Doe",
        sub: "",
        "custom:cms-roles": "",
        email_verified: false,
        username: ""
    });

    const mockEvent = {
        fail: 'fail',
    } as unknown as APIGatewayEvent;


    const result = await temporaryExtension(mockEvent);

    expect(result?.submitterName).toBeUndefined();

  });
  it("should find an item already exists", async () => {
    mockIsAuthorized.mockResolvedValueOnce(true);
    mockGetAuthDetails.mockReturnValueOnce({ userId: "user-123", poolId: "pool-123" });
    mockLookupUserAttributes.mockResolvedValueOnce({
        email: "john.doe@example.com",
        given_name: "John",
        family_name: "Doe",
        sub: "",
        "custom:cms-roles": "",
        email_verified: false,
        username: ""
    });
    mockItemExists.mockResolvedValueOnce(true)


    const mockEvent = {
      body: JSON.stringify(mockAppKPayload),
    } as APIGatewayEvent;

    await expect(temporaryExtension(mockEvent)).rejects.toThrow("Item Already Exists");

  });
  it("should not be able to find original waiver", async () => {
    mockIsAuthorized.mockResolvedValueOnce(true);
    mockGetAuthDetails.mockReturnValueOnce({ userId: "user-123", poolId: "pool-123" });
    mockLookupUserAttributes.mockResolvedValueOnce({
        email: "john.doe@example.com",
        given_name: "John",
        family_name: "Doe",
        sub: "",
        "custom:cms-roles": "",
        email_verified: false,
        username: ""
    });
    mockItemExists.mockResolvedValueOnce(false).mockResolvedValueOnce(false)


    const mockEvent = {
      body: JSON.stringify(mockAppKPayload),
    } as APIGatewayEvent;

    await expect(temporaryExtension(mockEvent)).rejects.toThrow("Original Waiver does not exis");

  });
  it("should process valid input and return transformed data", async () => {
    mockIsAuthorized.mockResolvedValueOnce(true);
    mockGetAuthDetails.mockReturnValueOnce({ userId: "user-123", poolId: "pool-123" });
    mockLookupUserAttributes.mockResolvedValueOnce({
        email: "john.doe@example.com",
        given_name: "John",
        family_name: "Doe",
        sub: "",
        "custom:cms-roles": "",
        email_verified: false,
        username: ""
    });
    mockItemExists.mockResolvedValueOnce(false).mockResolvedValueOnce(true)


    const mockEvent = {
      body: JSON.stringify(mockAppKPayload),
    } as APIGatewayEvent;

    const result = await temporaryExtension(mockEvent);

    expect(result?.submitterName).toEqual('John Doe');

  });
});
