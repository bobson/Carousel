This Carousel project is made with react core libreris, and Parcel for bundler. Parcel is zero-configuration bundler out of the box.

Run "npm i" or "yarn" to download the dependencies.
Run "npm run dev" or "yarn dev" to start the development server.
Run "npm run build" or "yarn build" for production build.

Carousel component takes 2 optional props: show and infinite.
If there is no show prop the default is 1 slide on the screen.You can specify max 4 slides on the screen:
<Carousel show={4}>
<img />
.
.
.
<Carousel />
If no infinite prop the default behavior is no looping, no repeating.
If there is infinite prop there is infinite slides.
<Carousel infinite show={2}>
<img />
<Carousel />
