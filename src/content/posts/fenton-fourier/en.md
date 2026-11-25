---
title: Fourier, a program for steady nonlinear waves
date: 2026-06-18
datePrecision: day
type: resource
summary: John Fenton's Fourier program solves steady nonlinear waves numerically by means of Fourier series and remains applicable to waves close to breaking; the same package provides fifth-order Stokes and cnoidal programs for cross-checking. This post describes their method, input and output, and ranges of validity, with an example.
inOverview: false
draft: false
cover: ./cover.svg
coverAlt: A nonlinear wave profile with sharp crests and flat troughs over a sine curve, beside the word Fourier
coverOnPage: false
links:
  - label: Program page
    url: https://johndfenton.com/Steady-waves/Fourier.html
  - label: Instructions
    url: https://johndfenton.com/Steady-waves/Instructions.pdf
---

<p class="lead">Design waves are commonly represented as regular waves; for large wave heights, however, both linear theory and low-order Stokes theory show significant errors. Higher-order Stokes theory is applicable in deep water and cnoidal theory in shallow water, but neither analytical theory is sufficiently accurate for large waves at intermediate depth or for waves close to breaking. The Fourier program published by John Fenton solves the full nonlinear problem numerically; its only approximation is the truncation of the Fourier series, and it provides accurate results even for waves close to the maximum height.</p>

## Method

The method was first proposed by Chappelear (1961) and was developed by Rienecker and Fenton (1981) into a form based entirely on Fourier series. The flow field and the free surface are expressed as Fourier series and substituted into the kinematic and dynamic boundary conditions on the free surface, which yields a system of nonlinear algebraic equations for the series coefficients, the wavenumber and the surface elevations; the system is solved by Newton's method.

For very high waves, the program first solves a sequence of lower waves and extrapolates step by step to the target height, so that the iteration does not converge to a spurious solution. For most problems, 10 to 20 terms suffice, even close to the maximum wave height; according to the instructions, the method is applicable up to about 98% of the maximum height for a given ratio of wavelength to depth.

## Program package

The Fourier package contains C++ source code and a Windows executable; the original Fortran version was published with Fenton (1988). The same website provides the Stokes and Cnoidal packages, which implement fifth-order Stokes theory (Fenton, 1985) and cnoidal theory (Fenton, 1999). The three programs read input files of the same format and can therefore be checked against one another; Fenton recommends the Fourier program for general use. The fifth-order Stokes demonstration in the [wave lab](/en/updates/wave-lab/) uses the coefficients of Fenton (1985).

## Input and output

The main parameters are specified in Data.dat: the relative wave height $H/d$, whether the wavelength or the period is prescribed and its value, the type and magnitude of the mean current, the number of Fourier terms, and the number of height steps for extrapolation. Convergence.dat specifies the number of iterations and the convergence criterion, and Points.dat the numbers of surface points and velocity profiles in the output.

When the period is prescribed, the mean current must be specified, for which two definitions are available: the time-mean velocity at a fixed point, that is, the Eulerian mean current, and the depth-integrated mass-transport velocity. The latter is zero in a closed wave tank, where there is no net mass transport. Since the two definitions give different wavelengths and wave speeds for the same period, the definition must be made consistent before results from different theories or programs are compared.

The program writes three text files: Solution.res, containing integral quantities such as the wave speed, mean currents, volume flux, Bernoulli constant, momentum flux, energies and radiation stress, together with the Fourier coefficients; Surface.res, containing the surface profile; and Flowfield.res, containing the velocities and accelerations along the profiles. Since 2019, the program also writes Solution-Flat.res, a format intended for reading by other programs. Gnuplot scripts included in the package plot the surface and the flow field.

## Ranges of validity of Stokes and cnoidal theory

The instructions also discuss the boundary between the ranges of validity of the two analytical theories. Fenton introduces the Stokes–Ursell number $\mathrm{SU} = \mathrm{Ur}/(8\pi^2)$, where $\mathrm{Ur} = HL^2/d^3$ is the Ursell number; the boundary $\mathrm{Ur} = 40$ proposed by Hedges (1995) corresponds to $\mathrm{SU} \approx 1/2$, above which Stokes theory should not be used. All three programs output this number. In the parameter plane of the wave lab, the second-order Stokes solution begins to show a secondary crest in the trough at $\mathrm{Ur} \approx 26$ ($\mathrm{SU} \approx 1/3$), broadly consistent with this boundary.

## Example

The figure below compares the surface profiles given by the Fourier program, fifth-order Stokes theory and linear theory for two cases. In case (a), with $H/d = 0.2$ and $L/d = 7$, the Stokes–Ursell number is $\mathrm{SU} = 0.12$ and the wave height is about 31% of the maximum for this wavelength; the Fourier and fifth-order Stokes profiles practically coincide, whereas linear theory underestimates the crest elevation. In case (b), with $H/d = 0.5$ and $L/d = 10$, $\mathrm{SU} = 0.63$, beyond the boundary discussed in the previous section, and the height is about 70% of the maximum. Fifth-order Stokes theory then underestimates the crest considerably and gives an unphysical undulating profile with a spurious secondary crest in the trough, while the Fourier program still yields a reasonable profile with a sharp crest and a flat trough.

![Surface profiles from the Fourier program, fifth-order Stokes theory and linear theory](./fourier-profiles-en.svg "Surface profiles over one wavelength, with the crest at $x/L = 0$: (a) $H/d = 0.2$, $L/d = 7$; (b) $H/d = 0.5$, $L/d = 10$.")

The Fourier results were computed with the C++ source code from the package. As the instructions note, 10 to 20 Fourier terms suffice for most problems; 20 terms were used in both cases. Both cases were solved with the wavelength prescribed, so the surface profiles do not depend on the definition of the mean current. The fifth-order Stokes profiles use the coefficients of Fenton (1985).

## Citation

- Chappelear J E. Direct numerical calculation of wave properties. *Journal of Geophysical Research*, 1961, 66(2): 501–508.
- Rienecker M M, Fenton J D. A Fourier approximation method for steady water waves. *Journal of Fluid Mechanics*, 1981, 104: 119–137.
- Fenton J D. A fifth-order Stokes theory for steady waves. *Journal of Waterway, Port, Coastal, and Ocean Engineering*, 1985, 111(2): 216–234.
- Fenton J D. The numerical solution of steady water wave problems. *Computers & Geosciences*, 1988, 14: 357–368.
- Fenton J D. The cnoidal theory of water waves. In: Herbich J B (ed.), *Developments in Offshore Engineering*. Houston: Gulf, 1999: 55–100.
- Hedges T S. Regions of validity of analytical wave theories. *Proceedings of the Institution of Civil Engineers – Water, Maritime and Energy*, 1995, 112: 111–114.
