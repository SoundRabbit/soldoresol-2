if (self instanceof DedicatedWorkerGlobalScope) {
  self.addEventListener('message', async (message) => {});
}
