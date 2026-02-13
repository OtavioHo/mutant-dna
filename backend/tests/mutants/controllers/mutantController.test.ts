import { describe, it, expect, vi, beforeEach } from "vitest";
import { FastifyRequest, FastifyReply } from "fastify";
import DefaultMutantsController from "../../../src/mutants/controllers/mutantController";
import MutantsService from "../../../src/mutants/services/mutantService.interface";

describe("DefaultMutantsController", () => {
  let controller: DefaultMutantsController;
  let mockMutantsService: MutantsService;
  let mockRequest: FastifyRequest;
  let mockReply: FastifyReply;

  beforeEach(() => {
    mockMutantsService = {
      checkDNA: vi.fn(),
    } as unknown as MutantsService;

    mockRequest = {} as FastifyRequest;

    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    controller = new DefaultMutantsController(mockMutantsService);
  });

  describe("checkMutant", () => {
    it("should return 200 when mutant is detected", async () => {
      vi.mocked(mockMutantsService.checkDNA).mockResolvedValue(true);

      await controller.checkMutant(mockRequest, mockReply);

      expect(mockMutantsService.checkDNA).toHaveBeenCalledWith([]);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: "Mutant detected",
      });
    });

    it("should return 403 when mutant is not detected", async () => {
      vi.mocked(mockMutantsService.checkDNA).mockResolvedValue(false);

      await controller.checkMutant(mockRequest, mockReply);

      expect(mockMutantsService.checkDNA).toHaveBeenCalledWith([]);
      expect(mockReply.status).toHaveBeenCalledWith(403);
      expect(mockReply.send).toHaveBeenCalledWith({ message: "Not a mutant" });
    });
  });
});
