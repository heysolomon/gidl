# use-gidl

CLI for adding [gidl](https://gidl.dev)'s animated UI components to your project.

## Usage

```bash
npx use-gidl add <component>
```

This fetches the component (and any files it depends on) straight from the [gidl registry](https://github.com/heysolomon/gidl) and writes them into your project, then installs its npm dependencies.

Browse available components at [gidl.dev/docs](https://gidl.dev/docs).

## Options

| Flag                | Description                      | Default           |
| ------------------- | -------------------------------- | ----------------- |
| `-p, --path <path>` | Where to write component files   | `./components/ui` |
| `--no-install`      | Skip installing npm dependencies | —                 |

## Example

```bash
npx use-gidl add collins-carousel
```

```
✨ Gidl - Adding component...

Fetching registry...
Fetching 8 file(s) for Collins Carousel...
  wrote ./components/ui/collins-carousel.tsx
  wrote lib/motion-carousel/Carousel.tsx
  ...

✓ Added Collins Carousel

Installing dependencies: motion
✓ Dependencies installed
```

If a component depends on a base [shadcn/ui](https://ui.shadcn.com) primitive (e.g. `tabs`), the CLI prints the command to install it separately.

## License

MIT
