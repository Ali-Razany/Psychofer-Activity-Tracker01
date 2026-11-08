import re

with open('src/index.css', 'r') as f:
    content = f.read()

new_css = """
/* 3D Book Styles for RTL with Opening Animation */
.book-container {
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1200px;
  padding: 20px;
}

.book-wrapper {
  position: relative;
  transform-style: preserve-3d;
  transform: rotateY(20deg) rotateX(10deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
  --thickness: 40px;
  --half-thickness: calc(var(--thickness) / 2);
}

.book-container:hover .book-wrapper {
  transform: rotateY(5deg) rotateX(2deg) scale(1.05);
}

.book-front, .book-back {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 5px 2px 2px 5px; /* Spine on the right (2px), pages on the left (5px) */
  box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transform-style: preserve-3d;
}

.book-front {
  transform: translateZ(var(--half-thickness));
  transform-origin: right center; /* RTL: Spine is on the right */
  transition: transform 0.8s ease, z-index 0.6s;
  z-index: 100;
}

.book-container:hover .book-front {
  transform: translateZ(var(--half-thickness)) rotateY(145deg);
  z-index: 0;
}

/* Inner cover to hide mirrored image */
.book-front::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f9f9f9;
  transform: translateZ(-1px);
  border-radius: 5px 2px 2px 5px;
  box-shadow: inset -4px 0 10px rgba(0, 0, 0, 0.05);
}

.book-back {
  transform: translateZ(calc(var(--half-thickness) * -1)) rotateY(180deg);
  background: #e0e0e0;
}

.book-ribbon {
  position: absolute;
  top: -5px;
  left: 30px;
  width: 15px;
  height: 50px;
  background: #e74c3c;
  z-index: 10;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.book-ribbon::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-top: 5px solid #e74c3c;
}

.book-spine-right {
  position: absolute;
  width: var(--thickness);
  height: 100%;
  right: 0;
  top: 0;
  transform-origin: right center;
  transform: rotateY(90deg) translateX(var(--half-thickness)) translateZ(var(--half-thickness));
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
}

.book-spine-right .spine-text {
  transform: rotate(90deg);
  white-space: nowrap;
  font-weight: bold;
  color: #333;
}

.book-pages-left {
  position: absolute;
  width: var(--thickness);
  height: 96%;
  background: #f5f5f5;
  left: 0;
  top: 2%;
  transform-origin: left center;
  transform: rotateY(-90deg) translateX(calc(var(--half-thickness) * -1)) translateZ(var(--half-thickness));
  background-image: repeating-linear-gradient(to right, #e4e4e4, #e4e4e4 1px, #f9f9f9 1px, #f9f9f9 3px);
  border-radius: 2px;
}

.book-pages-top {
  position: absolute;
  width: 98%;
  height: var(--thickness);
  background: #f5f5f5;
  top: 0;
  left: 1%;
  transform-origin: top center;
  transform: rotateX(90deg) translateY(calc(var(--half-thickness) * -1)) translateZ(var(--half-thickness));
  background-image: repeating-linear-gradient(to bottom, #e4e4e4, #e4e4e4 1px, #f9f9f9 1px, #f9f9f9 3px);
  border-radius: 2px;
}

.book-pages-bottom {
  position: absolute;
  width: 98%;
  height: var(--thickness);
  background: #f5f5f5;
  bottom: 0;
  left: 1%;
  transform-origin: bottom center;
  transform: rotateX(-90deg) translateY(var(--half-thickness)) translateZ(var(--half-thickness));
  background-image: repeating-linear-gradient(to top, #e4e4e4, #e4e4e4 1px, #f9f9f9 1px, #f9f9f9 3px);
  border-radius: 2px;
}

/* Flipping Pages */
.book-page-list {
  position: absolute;
  width: 98%;
  height: 96%;
  top: 2%;
  right: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  z-index: 10;
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--half-thickness) - 2px));
}

.book-page-list > li {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  background: #fff;
  border-radius: 5px 2px 2px 5px;
  box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.05), -1px 1px 2px rgba(0,0,0,0.1);
  transform-origin: right center; /* RTL: turn from spine */
  transition-property: transform;
  transition-timing-function: ease;
  background-image: repeating-linear-gradient(transparent, transparent 1.5rem, #f0f0f0 1.5rem, #f0f0f0 1.6rem);
  background-size: 100% 1.6rem;
  background-position: 0 2rem;
}

/* Hover off transitions */
.book-page-list > li:nth-child(1) { transition-duration: 0.6s; }
.book-page-list > li:nth-child(2) { transition-duration: 0.6s; }
.book-page-list > li:nth-child(3) { transition-duration: 0.4s; }
.book-page-list > li:nth-child(4) { transition-duration: 0.5s; }
.book-page-list > li:nth-child(5) { transition-duration: 0.6s; }

/* Hover on transitions */
.book-container:hover .book-page-list > li:nth-child(1) {
  transform: rotateY(30deg);
  transition-duration: 1.5s;
}
.book-container:hover .book-page-list > li:nth-child(2) {
  transform: rotateY(35deg);
  transition-duration: 1.8s;
}
.book-container:hover .book-page-list > li:nth-child(3) {
  transform: rotateY(118deg);
  transition-duration: 1.6s;
}
.book-container:hover .book-page-list > li:nth-child(4) {
  transform: rotateY(130deg);
  transition-duration: 1.4s;
}
.book-container:hover .book-page-list > li:nth-child(5) {
  transform: rotateY(140deg);
  transition-duration: 1.2s;
}
"""

content = re.sub(r'/\* 3D Book Styles for RTL \*/.*', new_css.strip(), content, flags=re.DOTALL)

with open('src/index.css', 'w') as f:
    f.write(content)

print("CSS updated successfully")
