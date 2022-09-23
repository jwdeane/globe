export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const html = (latitude, longitude, ip) => {
  console.log(latitude, longitude, ip);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Where Am I?</title>
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
				{ location: [${latitude},${longitude}], size: 0.1 },
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
		<h1>${ip}</h1>
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
    const { latitude, longitude } = request.cf;
    const ip = request.headers.get("CF-Connecting-IP");
    return new Response(html(latitude, longitude, ip), {
      headers: { "content-type": "text/html" },
    });
  },
};
