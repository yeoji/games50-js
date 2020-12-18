class SceneStack {
    constructor(sceneManager, stack = []) {
        this.sceneManager = sceneManager;

        this.stack = stack;
    }

    push(sceneKey, data) {
        this.sceneManager.pause(this.stack[this.stack.length - 1]);
        this.sceneManager.run(sceneKey, data);

        this.sceneManager.bringToTop(sceneKey);

        this.stack.push(sceneKey);
    }

    pop() {
        const sceneToRemove = this.stack.pop();
        this.sceneManager.stop(sceneToRemove);

        this.sceneManager.resume(this.stack[this.stack.length - 1]);
    }
}

export default SceneStack;