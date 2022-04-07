// Define our labelmap
// const labelMap = {
//   1: { name: 'ThumbsUp', color: 'red' },
//   2: { name: 'ThumbsDown', color: 'yellow' },
//   3: { name: 'ThankYou', color: 'lime' },
//   4: { name: 'LiveLong', color: 'blue' },
// }
import useSound from 'use-sound'

const labelMap = {
  1: { name: 'Mask', color: 'green' },
  2: { name: 'NoMask', color: 'red' },
}

// Define a drawing function
// eslint-disable-next-line import/prefer-default-export
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx, playNoMask) => {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <= boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      // Extract variables
      const [y, x, height, width] = boxes[i]
      const text = classes[i]

      // play sound
      if (Number(classes[0]) === 2 && parseFloat(scores[0]) > 0.9) {
        console.log('no mask')
        playNoMask()
      }
      // Set styling
      ctx.strokeStyle = labelMap[text].color
      ctx.lineWidth = 10
      ctx.fillStyle = 'white'
      ctx.font = '30px Arial'

      // DRAW!!
      ctx.beginPath()
      ctx.fillText(`${labelMap[text].name} - ${Math.round(scores[i] * 100) / 100}`, x * imgWidth, y * imgHeight - 10)
      // eslint-disable-next-line no-mixed-operators
      ctx.rect(x * imgWidth, y * imgHeight, width * imgWidth / 2, height * imgHeight / 2)
      ctx.stroke()
    }
  }
}
