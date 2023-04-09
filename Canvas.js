export default class Canvas{
    constructor(canvasEle,width,height){
        this.element = canvasEle;
        this.element.width = width;
        this.element.height = height;
        this.ctx = this.element.getContext("2d");
        this.width = width;
        this.height = height;
    }
    point(x,y){
        return {x,y}
    }
    setBackground(color){
        this.fill(color,()=>{
            this.rect(this.point(0,0),this.width,this.height);
        })
    }
    stroke(color,width,shape){
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;    
        shape()
        this.ctx.stroke();
    }
    fill(color,shape){
        this.ctx.beginPath();
        this.ctx.fillStyle = color;
        shape()
        this.ctx.fill();
    }
    
    rect(pos,width,height){
        this.ctx.rect(pos.x,pos.y,width,height);
    }
    ellipse(pos,r1,r2,rotation=0,start=0,end=2*Math.PI){
        this.ctx.ellipse(pos.x, pos.y,r1,r2,rotation,start,end);
    }
    
    line(pos1,pos2,color,width,dotted = false,dash = 5,space = 50){
        this.stroke(color,width,()=>{
            if (dotted){
                this.ctx.setLineDash([dash, space])
            }
            this.ctx.moveTo( pos1.x,pos1.y );     
            this.ctx.lineTo( pos2.x,pos2.y );
        })
    }
    
    getCursorPosition(canvas, event) {
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return {x,y}
    }

    Animate(SPEED,cancelFunc){
        this.animate(SPEED,cancelFunc)
    }
    animate(currentTime,cancelFunc){
        // Takes SPEED and cancelFunc as arguments. must return true to stop the animation.
        let r = requestAnimationFrame(animate)
        const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
        if(secondsSinceLastRender < 1 / SPEED) return
        // If you want to force the loop to stop,
        // cancelAnimationFrame(r)
        //- --------------------------------------------------
        if (cancelFunc()){
            cancelAnimationFrame(r)
        }
        // ---------------------------------------------------
        lastRenderTime = currentTime
    }

}