import { ComponentProps, ReactHTML, createElement } from 'react'
import { cva } from 'class-variance-authority'

interface Variants {
  [k: string]: {
    [k: string]: string
  }
}

type VariantsToValues<T extends Variants> = {
  [K in keyof T]: keyof T[K]
}

type IsDefined<T> = T extends undefined ? false : true

type ComponentPropsWithVariants<
  V extends Variants,
  E extends keyof ReactHTML,
> = {
  variants?: IsDefined<V> extends true ? VariantsToValues<V> : undefined
} & ComponentProps<E>

interface CVA<V extends Variants> {
  base?: string | string[]
  hover?: string | string[]
  variants?: V
}

export const CVAComponent = <E extends keyof ReactHTML, V extends Variants>(
  element: E,
  cvaObject: CVA<V>,
  displayName?: string,
) => {
  const { base = '', variants: requestVariants } = cvaObject

  const _variants = requestVariants ?? {}

  const createClassname = cva(base, { variants: _variants })

  const Component = ({
    children,
    className,
    variants,
    ...props
  }: ComponentPropsWithVariants<NonNullable<typeof requestVariants>, E>) => {
    const cvaClassName = createClassname({ className, ...variants })

    console.log({ cvaClassName })

    return createElement(
      element,
      { className: cvaClassName, ...props },
      children,
    )
  }

  Component.displayName = displayName

  return Component
}
