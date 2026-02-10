// A11yAllDefects.jsx
import { useState } from "react";

export default function A11yAllDefects() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* ❌ Missing page landmark + improper heading order */}
      <h3 onClick={() => alert("clicked")}>Welcome</h3>

      {/* ❌ Image without alt */}
      <img src="https://via.placeholder.com/100" />

      <img src="tst.jpg" />

      {/* ❌ Decorative image wrongly exposed */}
      <img src="https://via.placeholder.com/50" alt="decorative border" />

      {/* ❌ Video without captions */}
      <video controls width="250">
        <source src="movie.mp4" type="video/mp4" />
      </video>

      {/* ❌ Audio without transcript */}
      <audio controls src="audio.mp3" />

      {/* ❌ Link without href */}
      <a>Broken link</a>

      {/* ❌ Empty link text */}
      <a href="/home"></a>

      {/* ❌ Clickable div instead of button */}
      <div onClick={() => setOpen(!open)}>Open modal</div>

      {/* ❌ Button without accessible name */}
      <button></button>

      {/* ❌ Input without label */}
      <input type="text" placeholder="Name" />

      {/* ❌ Checkbox without label */}
      <input type="checkbox" />

      {/* ❌ Duplicate IDs */}
      <input id="email" />
      <input id="email" />

      {/* ❌ ARIA misuse */}
      <div role="button" aria-checked="true">Fake toggle</div>

      {/* ❌ Invalid ARIA attribute */}
      <div aria-wrong="true">Wrong aria</div>

      {/* ❌ Missing aria-describedby target */}
      <input aria-describedby="missing-id" />

      {/* ❌ Low color contrast */}
      <p style={{ color: "#ccc", background: "#fff" }}>
        Low contrast text
      </p>

      {/* ❌ Table without headers or caption */}
      <table border="1">
        <tr>
          <td>Name</td>
          <td>Age</td>
        </tr>
        <tr>
          <td>John</td>
          <td>25</td>
        </tr>
      </table>

      {/* ❌ List structure broken */}
      <ul>
        <div>Item 1</div>
        <div>Item 2</div>
      </ul>

      {/* ❌ Missing form fieldset/legend */}
      <form>
        <input type="radio" name="gender" value="m" /> Male
        <input type="radio" name="gender" value="f" /> Female
      </form>

      {/* ❌ Autofocus causing focus trap risk */}
      <input autoFocus />

      {/* ❌ Marquee (motion without control) */}
      <marquee>Moving text</marquee>

      {/* ❌ Modal without focus management or aria-modal */}
      {open && (
        <div style={{ border: "1px solid black", padding: 10 }}>
          <h2>Modal</h2>
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      )}

      {/* ❌ SVG without title */}
      <svg width="100" height="100">
        <circle cx="50" cy="50" r="40" />
      </svg>

      {/* ❌ iframe without title */}
      <iframe src="https://example.com"></iframe>
    </div>
  );
}
