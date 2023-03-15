svgPhone = document.getElementById('svgPhone')
svgNS = 'http://www.w3.org/2000/svg'
selectedElement = false
circArr = null
offset = 0

function drawBorder(cx = 0, cy = 0){
	angle = 0
  const radius1 = 200
  const radius2 = 145
  
  x1 = cx  + radius1 * Math.cos(-angle * Math.PI/180)
  y1 = cy  + radius1 * Math.sin(-angle * Math.PI/180)
  x2 = cx  + radius2 * Math.cos(-angle * Math.PI/180)
  y2 = cy  + radius2 * Math.sin(-angle * Math.PI/180)
  
  line = document.createElementNS(svgNS, 'line')
  line.setAttributeNS(null, "x1", x1)
  line.setAttributeNS(null, "y1", y1)
  line.setAttributeNS(null, "x2", x2)
  line.setAttributeNS(null, "y2", y2)
  line.setAttributeNS(null, "stroke-width", 5)
  line.setAttributeNS(null, "stroke", "gray")
  line.style.pointerEvents = 'none'
  svgPhone.append(line)
}
// function getBorders(){

// }
function pointsOnCircle({ cx, cy, radius, angle }) {
  x = cx + radius * Math.cos(-angle * Math.PI/180) 
  y = cy + radius * Math.sin(-angle * Math.PI/180)
  return [x, y]
}
function circleFactory({x, y, number, circles, i}) {
  circleRadius = 25
  g = document.createElementNS(svgNS, "g")
  circle = document.createElementNS(svgNS, "circle")
  text = document.createElementNS(svgNS, "text")

  // circle2 = document.createElementNS(svgNS, "circle")
  // circle2.setAttributeNS(null, "cx", x)
  // circle2.setAttributeNS(null, "cy", y)
  // circle2.setAttributeNS(null, "r", '4')
  // circle2.setAttributeNS(null, "stroke", "blue")
  // circle2.setAttributeNS(null, "stroke-width", 1)
  // circle2.setAttributeNS(null, "fill", "blue")

  circle.setAttributeNS(null, "cx", x)
  circle.setAttributeNS(null, "cy", y)
  circle.setAttributeNS(null, "r", circleRadius)
  circle.setAttributeNS(null, "stroke", "gray")
  circle.setAttributeNS(null, "stroke-width", 1)
  circle.setAttributeNS(null, "fill", "white")

  text.setAttributeNS(null, 'x', x - 8)
  text.setAttributeNS(null, 'y', y + 8)
  text.setAttributeNS(null,'font-size','25')
  text.innerHTML = number

  g.append(circle)
  g.append(text)
  // g.append(circle2)
  svgPhone.append(g)
  
  makeDraggable(g)
  circle.setAttributeNS(null, "fill", `rgb(${setColors()})`)
}
function createPhone(){
  const circles = 10
  const OFFSET = 90
  const distanceBetween = 1
  for(i = 0, number = 10; number--, i < circles; i++){
    // Convert from Degrees to Radians
    angle = (i * 360 / circles) * distanceBetween + OFFSET;
    angle = angle < 360 ? angle : angle - 360;
    [x, y] = pointsOnCircle({cx: 0, cy: 0, radius: 172.5, angle: angle})
    circleFactory({x: x, y: y, number: number, circles: circles, i: i})
    console.log(number +'\t\t'+ x +'\t\t'+ y +'\t\tangle '+ angle)
  }
  console.log('\n')
  // target nextSibling textContent
  drawBorder()
}
function makeDraggable(item){
	let elements = document.querySelectorAll('svg g')
  elements.forEach(function(el){
  	el.addEventListener('mousedown', startDrag)
	  el.addEventListener('mousemove', drag)
	  el.addEventListener('mouseup', endDrag)
	  el.addEventListener('mouseleave', endDrag)
  })
}

function startDrag(e) {
  selectedElement = e.target
  // circArr includes all phone circles except clicked (on click will be always 9 circles)
  circArr = Array.from(document.querySelectorAll('svg g circle')).filter(item => item !== selectedElement)

  selectedValue = selectedElement.nextSibling.textContent
  offset = getMousePosition(e)
  offset.x -= parseFloat(selectedElement.getAttributeNS(null, "cx"))
  offset.y -= parseFloat(selectedElement.getAttributeNS(null, "cy"))
}

function drag(e) {
  if(selectedElement){
    e.preventDefault()
    let coords = getMousePosition(e)
    let dragX = coords.x - offset.x
    let dragY = coords.y - offset.y
    // point on circle with radius 172.5 when dragging small circle(with number)
    angle = Math.atan2(dragY, dragX) * (180/Math.PI)
    // angle = getAngle(dragX, dragY)
    let [x, y] = pointsOnCircle({cx: 0, cy: 0, radius: parseFloat(172.5), angle: -angle})
    // circleFactory({x: x, y: y, number: '-'})

    // circle
    selectedElement.setAttributeNS(null, "cx", x)
    selectedElement.setAttributeNS(null, "cy", y)

    // text
    selectedElement.nextElementSibling.setAttributeNS(null, 'x', x - 8)
    selectedElement.nextElementSibling.setAttributeNS(null, 'y', y + 8)

    // console.log(` SELECTED ELEMENT: ${e.target.nextSibling.textContent}. ANGLE: ${-angle}`)
    
    // snake circle moving
    moveSnake(-angle)

    // console.log('drag    ', dragX, dragY)
  }
}
function endDrag(e) {
  selectedElement = null
  circArr = null
  // document.querySelectorAll('svg g circle').forEach(item => item.setAttributeNS(null, 'fill', 'white'))
}
function getMousePosition(e) {
  var CTM = svgPhone.getScreenCTM()
  return {
    x: (e.clientX - CTM.e) / CTM.a,
    y: (e.clientY - CTM.f) / CTM.d
  }
}
function moveSnake(angle){
  circArr.forEach(function(el, i){
    let x = el.cx.baseVal.value
    let y = el.cy.baseVal.value
    let item = el
    // angleSnake = Math.atan2(y, x) *(180/Math.PI) + 36
    let [xSnake, ySnake] = pointsOnCircle({ cx: 0, cy: 0, radius: parseFloat(172.5), angle: angle + (36 * ++i) })
    
    // circle
    item.setAttributeNS(null, 'cx', xSnake)
    item.setAttributeNS(null, 'cy', ySnake)
    selectedElement.setAttributeNS(null, 'fill', 'blue')
    // console.log(i +' '+ x +'\t\t'+ y +'\t\t snake '+ xSnake +'\t\t'+ ySnake +'\t\t angle '+ angleSnake)
    console.log(i +' '+ xSnake +'\t\t\t'+ ySnake +'\t\t\t angle '+ angle + (36 * ++i))
    // text
    el.nextElementSibling.setAttributeNS(null, 'x', xSnake - 8)
    el.nextElementSibling.setAttributeNS(null, 'y', ySnake + 8)
  })
  console.log('\n')
}
function getAngle(x, y){
  let angle = Math.atan2(y, x)

  if (angle < 0)
  {
      angle += 2 * Math.PI
  }

  return angle
}
function randomColor(min = 15, max = 255){
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function setColors(){
  return `${randomColor()}, ${randomColor()}, ${randomColor()}`
}



window.onload = createPhone()

// setInterval(function () {
//   let i= 0, n =10
//   i++, n--
//   angle = (i * 360 / 10) - OFFSET;
//   const [x, y] = pointsOnCircle({cx: 0, cy: 0, radius: 172.5, angle: angle});
//   console.log(x, y);
//   circleFactory({x: x, y: y, number: n});
//   document.querySelector("#degrees").innerHTML = angle + "&amp;deg;";
//   document.querySelector("#points").textContent = x.toFixed() + "," + y.toFixed();
// }, 100)


// https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
// dragable todo


 /*                       _____
 *                    __/_ ///
 *                   / _/    \
 *                   \/_\=[o=o]
 *                    \_,    __)
 *                     |     _\
 *                     l______/
 *                    /     :|
 *                   /  \   ;|-
 *                   \_______j
 *                   ./.....\..
 */