import * as E from "fp-ts/lib/Either"

export type Coproduct4<A, B, C, D> = E.Either<A, E.Either<B, E.Either<C, D>>>

export function a<A>(v: A): Coproduct4<A, any, any, any> { return E.left(v) }
export function b<B>(v: B): Coproduct4<any, B, any, any> { return E.right(E.left(v)) }
export function c<C>(v: C): Coproduct4<any, any, C, any> { return E.right(E.right(E.left(v))) }
export function d<D>(v: D): Coproduct4<any, any, any, D> { return E.right(E.right(E.right(v))) }

export function fold<A, B, C, D, R>(
    onA: (v: A) => R,
    onB: (v: B) => R,
    onC: (v: C) => R,
    onD: (v: D) => R
): (c: Coproduct4<A, B, C, D>) => R {
    return E.fold(onA, E.fold(onB, E.fold(onC, onD)))
}

type fromPairOfSumsFT = <A, B, C, D>(ab: E.Either<A, B>, cd: E.Either<C, D>) => Coproduct4<[A, C], [A, D], [B, C], [B, D]>
export const fromPairOfSums: fromPairOfSumsFT = <A, B, C, D>(ab: E.Either<A, B>, cd: E.Either<C, D>) => (
    E.isLeft(ab) && E.isLeft(cd) ?
        a([ab.left, cd.left]) :
        E.isLeft(ab) && E.isRight(cd) ?
            b([ab.left, cd.right]) :
            E.isRight(ab) && E.isLeft(cd) ?
                c([ab.right, cd.left]) :
                d([(ab as unknown as E.Right<A>).right, (cd as unknown as E.Right<A>).right])
)
