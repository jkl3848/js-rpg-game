//The main graphics rendering loop
class GameLoop {
    constructor(update, render) {

        this.lastFrameTime = 0
        this.totalTime = 0
        this.timeStep = 1000/60 //30 fps

        this.update = update
        this.render = render

        this.rafId = null;
        this.isRunning = false
    }

    mainLoop = (timestamp) => {
        if(!this.isRunning) return

        //How much time has passed since last run of the loop
        let deltaTime = timestamp - this.lastFrameTime
        this.lastFrameTime = timestamp

        this.totalTime += deltaTime

        //If enough time has passed since the last update, update again
        while(this.totalTime >= this.timeStep){
            this.update(this.timeStep)
            this.totalTime -= this.timeStep
        }

        this.render()

        //This works with the browser to time the update to the page timing
        this.rafId = requestAnimationFrame(this.mainLoop)
    }

    //Starts off the first loop
    start(){
        if(!this.isRunning){
            this.isRunning = true
            this.rafId = requestAnimationFrame(this.mainLoop)
        }
    }

    //Stops the loop, good for game pause, etc
    stop(){
        if(this.rafId){
            cancelAnimationFrame(this.rafId)
        }
        this.isRunning = false
    }
}