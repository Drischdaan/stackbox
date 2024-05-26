import { ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PUBLIC_ENDPOINT_KEY = 'publicEndpoint';
export const PublicEndpoint = () => SetMetadata(PUBLIC_ENDPOINT_KEY, true);

export function isPublicEndpoint(
  context: ExecutionContext,
  reflector: Reflector,
): boolean {
  const isPublic = reflector.getAllAndOverride<boolean>(PUBLIC_ENDPOINT_KEY, [
    context.getHandler(),
    context.getClass(),
  ]);
  return isPublic;
}
