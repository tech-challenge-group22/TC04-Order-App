import ExpressAdapter from '../../../src/application/adapters/ExpressAdapter';
import http from 'http'; // Mock the underlying http module

jest.mock('http');

describe('ExpressAdapter', () => {
  it('should apply middleware', () => {
    const adapter = new ExpressAdapter();
    expect(adapter.server._middleware.length).toBeGreaterThan(0);
  });

  it('should start listening on the specified port', async () => {
    const adapter = new ExpressAdapter();
    const port = 3000;

    await adapter.listen(port);

    expect(adapter.isRunning()).toBeTruthy();
    expect(adapter.isRunningOnPort(port)).toBeTruthy();

    // Verify that the underlying http.createServer() was called with the correct port
    expect(http.createServer).toHaveBeenCalledWith(adapter.server);
  });

  it('should close the server', async () => {
    const adapter = new ExpressAdapter();
    await adapter.listen(3000);

    await adapter.close();

    expect(adapter.isRunning()).toBeFalsy();
  });
});
