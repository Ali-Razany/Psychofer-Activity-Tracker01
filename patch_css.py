import re

with open('src/index.css', 'r') as f:
    content = f.read()

new_css = """
/* 3D Book Styles for RTL */
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
  transform: rotateY(0deg) rotateX(0deg) scale(1.05);
}

.book-front, .book-back {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 5px 2px 2px 5px; /* Spine on the right (2px), pages on the left (5px) */
  box-shadow: inset 4px 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
}

.book-front {
  transform: translateZ(var(--half-thickness));
}

.book-back {
  transform: translateZ(calc(var(--half-thickness) * -1)) rotateY(180deg);
  background: #e0e0e0;
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
"""

content = re.sub(r'/\* 3D Book Styles for RTL \*/.*', new_css.strip(), content, flags=re.DOTALL)

with open('src/index.css', 'w') as f:
    f.write(content)

print("CSS updated successfully")
