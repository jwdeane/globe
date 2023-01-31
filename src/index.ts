export interface Env {}

interface CustomProps extends IncomingRequestCfProperties {
  ip: string | null;
}

const html = (options: CustomProps) => {
  console.log(JSON.stringify(options));
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Where Am I?</title>
	<link
      rel="icon"
      href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌏</text></svg>"
    />
	<style>
		body {
			background: #000;
			color: #fff;
		}
		
		#app {
			font-family: sans-serif;
			text-align: center;
		}
	</style>	
	<script type="module">
		import createGlobe from 'https://cdn.skypack.dev/cobe'

		let phi = 0;
		let canvas = document.getElementById("cobe");

		const globe = createGlobe(canvas, {
			devicePixelRatio: 2,
			width: 300 * 2,
			height: 300 * 2,
			phi: 0,
			theta: 0,
			dark: 1,
			diffuse: 1.2,
			mapSamples: 16000,
			mapBrightness: 6,
			baseColor: [0.3, 0.3, 0.3],
			markerColor: [0.1, 0.8, 1],
			glowColor: [1, 1, 1],
			markers: [
				// longitude latitude
				{ location: [${options.latitude},${options.longitude}], size: 0.1 },
			],
			onRender: (state) => {
				// Called on every animation frame.
				// 'state' will be an empty object, return updated params.
				state.phi = phi;
				phi += 0.03;
			},
		});
	</script>
</head>
<body>
	<div id="app">
		<canvas
			id="cobe"
			style="width: 300px; height: 300px;"
			width="600"
			height="600"
		></canvas>
		<h1>${options.ip}</h1>
		<h2>${options.city}, ${options.country}</h2>
	</div>
</body>
</html>
`;
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const ip = request.headers.get("CF-Connecting-IP");
    const options: CustomProps = { ip, ...request.cf };
    return new Response(html(options), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
};
