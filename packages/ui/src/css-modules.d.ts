// This package is consumed as raw source by apps/web via Next.js's
// transpilePackages, which already knows how to type *.module.css there.
// This declaration exists so `tsc --noEmit` also passes when this package
// is type-checked on its own (its tsconfig has no reason to depend on Next).
declare module "*.module.css" {
  const classes: { readonly [className: string]: string };
  export default classes;
}
