import { FastifyReply, FastifyRequest } from "fastify";
import helloService from "../services/helloService";

const getHello = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = helloService.getMessage();
  return reply.code(200).send(data);
};

export default { getHello };
