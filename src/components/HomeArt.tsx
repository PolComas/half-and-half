// Original SVG illustration for the home, not a generated room image.
export default function HomeArt() {
  return (
    <div className="art-wrap">
      <div className="art-caption">
        <span>Made of two imaginations</span>
        <span>✳</span>
      </div>
      <svg
        viewBox="0 0 580 570"
        role="img"
        aria-label="An illustrated moon, teapot and climbing garden, with one side colored and one side waiting for color"
      >
        <defs>
          <clipPath id="colored-half">
            <path d="M0 0H290V570H0Z" />
          </clipPath>
        </defs>
        <rect x="38" y="22" width="504" height="518" rx="4" fill="#FFFEF9" />
        <g
          stroke="#302D26"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <g fill="none">
            <path d="M106 447H474M112 453L99 475M465 453L478 475" />
            <path d="M124 446C122 388 124 303 161 261C184 233 214 250 193 281C175 304 149 286 165 268" />
            <path d="M142 368C104 362 94 337 111 326C132 316 150 341 142 368ZM133 404C163 403 182 377 167 365C149 353 130 378 133 404Z" />
            <path d="M426 443C451 387 453 333 425 286C408 259 386 271 395 290C404 310 432 302 421 282" />
            <path d="M443 368C469 356 489 327 468 319C450 311 435 344 443 368ZM438 408C402 399 386 375 404 365C425 354 443 386 438 408Z" />
            <path d="M200 334C174 339 168 362 187 377L211 384M346 336L393 319L384 354L350 376" />
            <path d="M206 323C197 355 197 405 224 431C247 451 320 454 342 430C367 405 363 355 348 323Z" />
            <path d="M205 323Q278 295 349 323M228 313L239 297Q278 286 317 297L329 313M268 292C253 268 298 267 286 291" />
            <path d="M223 370C241 348 264 354 277 376C289 347 318 354 337 373M232 393C253 413 312 418 332 390" />
            <path d="M249 255C218 227 254 214 245 186M283 257C252 224 303 204 283 171M318 253C291 228 330 212 319 193" />
            <path d="M336 99C294 67 240 97 242 139C243 180 288 205 326 181C287 183 266 153 280 124C290 103 314 94 336 99Z" />
            <path d="M183 143L189 126L195 143L212 149L195 155L189 172L183 155L166 149Z" />
            <path d="M380 187L385 174L391 187L405 193L391 199L385 213L380 199L366 193Z" />
            <circle cx="168" cy="213" r="5" />
            <circle cx="369" cy="125" r="4" />
            <circle cx="417" cy="241" r="5" />
            <path d="M214 448L203 476M340 447L353 476M194 476H217M341 476H363" />
          </g>
          <g clipPath="url(#colored-half)">
            <path
              d="M142 368C104 362 94 337 111 326C132 316 150 341 142 368ZM133 404C163 403 182 377 167 365C149 353 130 378 133 404Z"
              fill="#8C9B72"
            />
            <path d="M200 334C174 339 168 362 187 377L211 384" fill="#DF8965" />
            <path
              d="M206 323C197 355 197 405 224 431C247 451 320 454 342 430C367 405 363 355 348 323Z"
              fill="#E7A180"
            />
            <path
              d="M223 370C241 348 264 354 277 376C289 347 318 354 337 373M232 393C253 413 312 418 332 390"
              fill="none"
            />
            <path d="M228 313L239 297Q278 286 317 297L329 313" fill="#8C9B72" />
            <path
              d="M336 99C294 67 240 97 242 139C243 180 288 205 326 181C287 183 266 153 280 124C290 103 314 94 336 99Z"
              fill="#EBC86E"
            />
            <path
              d="M183 143L189 126L195 143L212 149L195 155L189 172L183 155L166 149Z"
              fill="#EBC86E"
            />
          </g>
        </g>
        <path
          d="M290 52V515"
          stroke="#CDC6B7"
          strokeDasharray="4 7"
          strokeWidth="1"
        />
        <text
          x="142"
          y="513"
          fontFamily="Georgia, serif"
          fontSize="15"
          fill="#71685B"
        >
          your colors
        </text>
        <text
          x="344"
          y="513"
          fontFamily="Georgia, serif"
          fontSize="15"
          fill="#71685B"
        >
          their surprise
        </text>
      </svg>
      <span className="art-note">
        An example illustration. Your drawing starts with your ideas.
      </span>
    </div>
  );
}
