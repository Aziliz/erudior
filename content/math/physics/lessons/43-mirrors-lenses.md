---
id: phys-mirrors-lenses
module: phys-m11
title: Mirrors and thin lenses
minutes: 45
topics: [Mirrors, Thin lenses]
drills: [phys-thin-lens, phys-mirror, phys-two-lens]
refs: [phys-ref-em-modern]
---
## Making images

Reflection and refraction let us bend light on purpose. Curved mirrors and lenses collect rays from each point of an object and send them to (or make them appear to come from) a corresponding point: an image. Eyeglasses, cameras, microscopes, telescopes and your own eyes all work this way. This lesson develops one equation that handles mirrors and lenses alike, plus ray diagrams to check it.

## Plane mirrors

A flat mirror forms an image as far behind the mirror as the object is in front, the same size and upright. The image is **virtual**: light doesn't actually come from behind the mirror, it only appears to. (A **real image** is one where light rays actually converge, so it can be projected onto a screen.) A plane mirror also reverses front and back, which is why text looks reversed.

## Spherical mirrors

A **concave mirror** (curved inward, like the inside of a spoon) reflects rays parallel to its axis so they converge through the **focal point** F, a distance $f$ (the **focal length**) in front of the mirror. For a spherical mirror of radius of curvature $R$, $f = R/2$. A **convex mirror** (curved outward) makes parallel rays diverge as if from a focal point behind it; we give it a negative focal length.

## Thin lenses

A **converging lens** (thicker in the middle) refracts parallel rays to a focal point on the far side. A **diverging lens** (thinner in the middle) spreads them as if from a focal point on the near side; its focal length is negative. A lens has a focal point on each side, at equal distances for a thin lens.

## The thin-lens and mirror equation

With object distance $d_o$, image distance $d_i$ and focal length $f$, both mirrors and thin lenses obey

$$\frac{1}{d_o} + \frac{1}{d_i} = \frac{1}{f},$$

and the **magnification**, the ratio of image height to object height, is

$$m = \frac{h_i}{h_o} = -\frac{d_i}{d_o}.$$

*Sign conventions* (the most common source of errors):

- $f > 0$ for concave mirrors and converging lenses; $f < 0$ for convex mirrors and diverging lenses.
- $d_o > 0$ for real objects.
- $d_i > 0$ for a real image (in front of a mirror; on the far side of a lens); $d_i < 0$ for a virtual image (behind a mirror; on the same side of a lens as the object).
- $m > 0$: upright image; $m < 0$: inverted. $|m| > 1$: enlarged.

## Ray diagrams

Three easy rays locate the image for a converging lens (and similarly for mirrors):

1. A ray parallel to the axis refracts through the far focal point.
2. A ray through the center of the lens passes straight through.
3. A ray through the near focal point emerges parallel to the axis.

Where the rays cross is the image. If they diverge after the lens, extend them backward to find a virtual image.

```shape
{"segments": [{"from": [-6, 0], "to": [8, 0], "dashed": true}, {"from": [0, -2.2], "to": [0, 2.2], "label": "lens"}, {"from": [-4.5, 0], "to": [-4.5, 1.5], "arrow": true, "label": "object"}, {"from": [-4.5, 1.5], "to": [0, 1.5]}, {"from": [0, 1.5], "to": [6, -2.5], "arrow": true}, {"from": [-4.5, 1.5], "to": [6, -2], "arrow": true}, {"from": [4.5, 0], "to": [4.5, -1.5], "arrow": true, "label": "image"}], "points": [{"at": [-2.25, 0], "label": "F"}, {"at": [2.25, 0], "label": "F"}], "caption": "Converging lens, object at 2f: the image is real, inverted, same size, at 2f on the far side"}
```

The general pattern for a converging lens or concave mirror:

| Object position | Image |
|---|---|
| Beyond $2f$ | real, inverted, smaller (camera, eye) |
| At $2f$ | real, inverted, same size |
| Between $f$ and $2f$ | real, inverted, larger (projector) |
| At $f$ | no image (rays emerge parallel) |
| Inside $f$ | virtual, upright, larger (magnifying glass, makeup mirror) |

Diverging lenses and convex mirrors always give virtual, upright, smaller images, which is why convex mirrors give wide fields of view in stores and on cars ("objects in mirror are closer than they appear").

### Example 1

An object 4.0 cm tall stands 30 cm from a converging lens of focal length 10 cm. Locate and describe the image.

$\dfrac{1}{d_i} = \dfrac{1}{10} - \dfrac{1}{30} = \dfrac{2}{30}$, so $d_i = 15$ cm (positive: real, on the far side).

$m = -15/30 = -0.50$: inverted, half size, $h_i = -2.0$ cm.

### Example 2

The same lens, with the object 6.0 cm away.

$\dfrac{1}{d_i} = \dfrac{1}{10} - \dfrac{1}{6.0} = -\dfrac{1}{15}$, so $d_i = -15$ cm: a virtual image on the object's side.

$m = -(-15)/6.0 = +2.5$: upright and 2.5 times larger. This is a magnifying glass.

### Example 3

A convex security mirror has a radius of curvature of 1.2 m. A shopper stands 3.0 m away. Where is the image and how big is it?

$f = -R/2 = -0.60$ m. $\dfrac{1}{d_i} = -\dfrac{1}{0.60} - \dfrac{1}{3.0} = -2.0$, so $d_i = -0.50$ m (virtual, behind the mirror). $m = -(-0.50)/3.0 = +0.17$: upright, one-sixth size.

## Lens power and lens systems

**Lens power** is $P = 1/f$ in diopters (m⁻¹); optometrists prescribe lenses this way. A nearsighted eye focuses distant objects in front of the retina and needs a diverging (negative-power) lens; a farsighted eye needs a converging one. In multi-lens systems, the image from the first lens acts as the object for the second, and the total magnification is the product $m_1m_2$. The next lesson uses these ideas for the eye, eyeglasses, magnifiers, microscopes and telescopes.

### Example 4: two lenses

An object is 15 cm in front of a converging lens with $f_1 = 10$ cm. A second converging lens, $f_2 = 20$ cm, sits 60 cm beyond the first. Find the final image and the overall magnification.

Lens 1: $\dfrac{1}{d_{i1}} = \dfrac{1}{10} - \dfrac{1}{15} = \dfrac{1}{30}$, so $d_{i1} = 30$ cm and $m_1 = -30/15 = -2.0$.

That image is a real object for lens 2, at $d_{o2} = 60 - 30 = 30$ cm in front of it. Lens 2: $\dfrac{1}{d_{i2}} = \dfrac{1}{20} - \dfrac{1}{30} = \dfrac{1}{60}$, so $d_{i2} = 60$ cm beyond lens 2, with $m_2 = -60/30 = -2.0$.

Overall: $m = m_1m_2 = (-2.0)(-2.0) = +4.0$. The final image is real, upright (inverted twice) and four times the object's size.

If lens 2 were only 50 cm from lens 1, the intermediate image would sit exactly at its focal point, 20 cm in front of it, and the rays would leave lens 2 parallel: a final image at infinity. That is what a microscope or telescope eyepiece is designed to do, so a relaxed eye can view the image.

## The lensmaker's equation

What sets a lens's focal length? Applying Snell's law at each curved surface (using the small-angle approximation, in which $\sin\theta \approx \theta$ for angles in radians) gives the **lensmaker's equation**:

$$\frac1f = (n - 1)\left(\frac{1}{R_1} - \frac{1}{R_2}\right),$$

where $R_1$ and $R_2$ are the radii of the front and back surfaces (positive if the surface's center of curvature is on the outgoing side of the lens). You don't need the derivation to use its proportional reasoning: a lens bends light more, giving a shorter focal length, if its surfaces are more strongly curved (smaller $R$) or its material has a higher index. A lens that does nothing has $n = 1$ (it's made of air). In water the relevant index is $n_{\text{lens}}/n_{\text{water}}$, closer to 1, so a glass lens is much weaker underwater. The same thing happens to the curved front surface of your eye (the cornea), which does most of the eye's focusing in air; that's why your vision blurs when you open your eyes in a pool.

## Common mistakes

- Sign errors: diverging lenses and convex mirrors need negative $f$; virtual images have negative $d_i$.
- Forgetting the minus sign in $m = -d_i/d_o$.
- Assuming every image is real or every image is inverted.
- Using $f = R$ instead of $R/2$ for a mirror.

## Key points

- $\dfrac1{d_o} + \dfrac1{d_i} = \dfrac1f$; $m = -\dfrac{d_i}{d_o}$.
- $f > 0$: converging lens, concave mirror; $f < 0$: diverging lens, convex mirror. Mirror $f = R/2$.
- $d_i > 0$ real, $d_i < 0$ virtual; $m < 0$ inverted.
- Converging optics give real inverted images beyond $f$, virtual enlarged images inside $f$; diverging optics give only virtual, upright, reduced images.
- Lens power $P = 1/f$ (diopters); multi-lens magnification multiplies.
