import React from "react";

export default function A11yInspectAllIssues() {
  return (
    <div onClick={() => console.log("wrapper clicked")}>
      {/* ---------------- DOCUMENT STRUCTURE ---------------- */}

      {/* ❌ Multiple H1s */}
      <h1>Main Heading</h1>
      <h1>Another Main Heading</h1>

      {/* ❌ Heading order skipped */}
      <h4>Skipped Heading</h4>

      {/* ❌ No landmarks */}
      <div className="page-content">

        {/* ---------------- IMAGES & MEDIA ---------------- */}

        {/* ❌ Missing alt */}
        <img src="/image1.png" />

        {/* ❌ Decorative image but alt missing */}
        <img src="/decorative.png" role="presentation" />

        {/* ❌ Video autoplay, no controls */}
        <video src="/video.mp4" autoPlay />

        {/* ❌ Audio without controls */}
        <audio src="/audio.mp3" />

        {/* ---------------- LINKS ---------------- */}

        {/* ❌ Anchor without href */}
        <a onClick={() => alert("Clicked")}>Click here</a>

        {/* ❌ Vague link text */}
        <a href="/more">Read more</a>

        {/* ❌ Link opens new tab without warning */}
        <a href="https://example.com" target="_blank">
          External site
        </a>

        {/* ---------------- BUTTONS & INTERACTION ---------------- */}

        {/* ❌ Clickable div */}
        <div onClick={() => alert("Clicked")}>Submit</div>

        {/* ❌ Button without accessible name */}
        <button />

        {/* ❌ Missing type attribute */}
        <button>Save</button>

        {/* ❌ Disabled button without explanation */}
        <button disabled>Pay Now</button>

        {/* ❌ onClick without keyboard support */}
        <span onClick={() => alert("Span clicked")}>Clickable span</span>

        {/* ---------------- FORMS ---------------- */}

        <form>
          {/* ❌ Input without label */}
          <input type="text" placeholder="Name" />

          {/* ❌ Label not associated */}
          <label>Email</label>
          <input type="email" />

          {/* ❌ Required field not announced */}
          <input type="password" required />

          {/* ❌ Placeholder-only instruction */}
          <input type="text" placeholder="Enter OTP" />

          {/* ❌ Error message not programmatically linked */}
          <input type="text" aria-invalid="true" />
          <span style={{ color: "red" }}>Invalid input</span>

          {/* ❌ Select without label */}
          <select>
            <option>Select country</option>
          </select>
        </form>

        {/* ---------------- KEYBOARD & FOCUS ---------------- */}

        {/* ❌ tabindex misuse */}
        <div tabIndex="5">Focusable but wrong order</div>

        {/* ❌ Focusable element hidden */}
        <button style={{ display: "none" }}>Hidden focus</button>

        {/* ❌ No focus indicator */}
        <a href="/test" style={{ outline: "none" }}>
          No focus style
        </a>

        {/* ---------------- ARIA MISUSE ---------------- */}

        {/* ❌ Invalid ARIA role */}
        <div role="banana">Invalid role</div>

        {/* ❌ aria-label on non-interactive element */}
        <div aria-label="Important info">Text</div>

        {/* ❌ Conflicting ARIA */}
        <button aria-hidden="true">Invisible button</button>

        {/* ❌ aria-required without required */}
        <input aria-required="true" />

        {/* ---------------- COLOR & VISUAL ---------------- */}

        {/* ❌ Color-only error */}
        <p style={{ color: "red" }}>Error occurred</p>

        {/* ❌ Low contrast text */}
        <p style={{ color: "#ccc", background: "#fff" }}>
          Low contrast text
        </p>

        {/* ---------------- TABLES ---------------- */}

        {/* ❌ Table without headers */}
        <table>
          <tr>
            <td>Name</td>
            <td>Age</td>
          </tr>
        </table>

        {/* ❌ Missing scope */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>

        {/* ---------------- LISTS ---------------- */}

        {/* ❌ Non-semantic list */}
        <div>
          <div>Item 1</div>
          <div>Item 2</div>
        </div>

        {/* ---------------- MODALS / DIALOGS ---------------- */}

        {/* ❌ Dialog without role or focus management */}
        <div className="modal">
          <p>Are you sure?</p>
          <button>Yes</button>
        </div>

        {/* ---------------- IFRAME ---------------- */}

        {/* ❌ iframe without title */}
        <iframe src="https://example.com" />

        {/* ---------------- LANGUAGE ---------------- */}

        {/* ❌ No lang attribute on page */}
        <p>Bonjour</p>

      </div>
    </div>
  );
}
