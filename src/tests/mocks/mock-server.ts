import {
  getMockServer as getMockServerOriginal,
  getConnectedSocket as getConnectedSocketOriginal,
  MockConnectedSocketOptions,
  MockServerOptions,
} from 'airdcpp-apisocket/tests';

export type MockServer = ReturnType<typeof getMockServer>;

export const getMockServer = (options: Partial<MockServerOptions> = {}) => {
  const server = getMockServerOriginal({
    delayMs: 0,
    ...options,
  });
  return server;
};

export const getConnectedSocket = async (
  server: MockServer,
  userOptions?: Partial<MockConnectedSocketOptions>,
) => {
  return getConnectedSocketOriginal(server, userOptions);
};
