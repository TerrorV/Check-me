// Provide a definition for Worker global scope
(self as DedicatedWorkerGlobalScope).onmessage = function (e: MessageEvent) {
    console.log("THIS IS THE WORKER TEXT");
    setInterval(() => {
      //self.postMessage(e.data.toUpperCase());
      self.postMessage("THIS IS THE WORKER TEXT");
    }, 500)
  }

  export {}