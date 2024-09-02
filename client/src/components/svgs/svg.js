import React from 'react'

function Menu() {
  return (
    <svg 
    width="45px" 
    height="45px" 
    viewBox="0 0 24 24" 
    fill="white" 
    xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default Menu
export function EmptyCart({styleProps}) {
  return (
    <svg
    fill="#272727" 
    className={styleProps}
    version="1.1" 
    id="Layer_1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink" 
	  viewBox="0 0 300 300" 
    xmlSpace="preserve">
    <g id="XMLID_108_">
      <path id="XMLID_109_" d="M189.555,21.429C187.95,14.872,182.052,10,175,10s-12.95,4.873-14.555,11.429
        c-29.553,5.837-52.926,29.08-58.935,58.571h146.98C242.48,50.509,219.107,27.266,189.555,21.429z"/>
      <path id="XMLID_110_" d="M70,74.999V15c0-8.284-6.716-15-15-15H15c-8.284,0-15,6.716-15,15s6.716,15,15,15h25v44.999v5v30v15v40v60
        c0,8.284,6.716,15,15,15h7.58c-1.665,4.695-2.58,9.742-2.58,15c0,24.813,20.187,45,45,45s45-20.187,45-45
        c0-5.258-0.915-10.305-2.58-15h34.16c-1.665,4.695-2.58,9.742-2.58,15c0,24.813,20.186,45,45,45s45-20.187,45-45
        c0-5.258-0.915-10.305-2.58-15H285c8.284,0,15-6.716,15-15c0-8.284-6.716-15-15-15H70v-30h215c8.284,0,15-6.716,15-15v-40
        c0-8.284-6.716-15-15-15h-36.51H101.51H70v-30V74.999z M224,239.999c8.271,0,15,6.729,15,15c0,8.271-6.729,15-15,15
        s-15-6.729-15-15C209,246.729,215.729,239.999,224,239.999z M105,239.999c8.271,0,15,6.729,15,15c0,8.271-6.729,15-15,15
        s-15-6.729-15-15C90,246.729,96.729,239.999,105,239.999z"/>
    </g>
</svg>
  )
}

export function Success({fillColor, h, w, styleProp}) {
  return (
    <div>
      <svg 
      xmlns="http://www.w3.org/2000/svg" 
      id="Layer_1" 
      data-name="Layer 1" 
      viewBox="0 0 24 24" 
      width={w}
      height={h}
      fill={fillColor}
      className={styleProp}
      >
      <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-.091,15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z"/>
      </svg>
    </div>
  );
}