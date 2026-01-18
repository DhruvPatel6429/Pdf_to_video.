from manim import *
import json
import os
import wave


def get_audio_duration(path):
    try:
        with wave.open(path, "rb") as f:
            return f.getnframes() / f.getframerate()
    except Exception:
        return 3


class AutoExplainer(Scene):
    def construct(self):

        with open("scene_graph.json", "r", encoding="utf-8") as f:
            scenes = json.load(f)

        for scene in scenes:

            sid = scene["scene_id"]
            title_text = scene["concept"]
            explanation = scene.get("explanation", [])
            equations = scene.get("equations", [])
            visual = scene.get("visual", "none")

            # -------- AUDIO --------
            audio_path = f"audio/scene_{sid}.wav"
            audio_time = 3
            if os.path.exists(audio_path):
                self.add_sound(audio_path)
                audio_time = get_audio_duration(audio_path)

            # -------- TITLE --------
            title = Text(title_text, font_size=36).to_edge(UP)
            self.play(FadeIn(title))

            # -------- EXPLANATION --------
            text_group = VGroup(
                *[Text(line, font_size=24) for line in explanation]
            ).arrange(DOWN, aligned_edge=LEFT, buff=0.25)
            text_group.next_to(title, DOWN, buff=0.4)
            self.play(FadeIn(text_group))

            # -------- FORMULAS --------
            eq_group = VGroup()
            box_group = VGroup()

            for eq in equations:
                try:
                    formula = MathTex(eq, font_size=36)
                except Exception:
                    formula = Text(eq, font_size=26)

                box = SurroundingRectangle(
                    formula,
                    color=YELLOW,
                    buff=0.3
                )

                eq_group.add(formula)
                box_group.add(box)

            if len(eq_group) > 0:
                eq_group.arrange(DOWN, buff=0.3)
                box_group.arrange(DOWN, buff=0.3)
                eq_group.next_to(text_group, DOWN, buff=0.6)
                box_group.move_to(eq_group)

                self.play(Write(eq_group))
                self.play(Create(box_group))
                self.play(box_group[0].animate.set_color(RED), run_time=0.5)

            # -------- VISUAL ZONE --------
            visual_origin = ORIGIN + DOWN * 2.2

            # ---- Linear Regression ----
            if visual == "linear_regression":
                axes = Axes(
                    x_range=[0, 6],
                    y_range=[0, 6],
                    x_length=6,
                    y_length=3
                ).shift(visual_origin)

                points = VGroup(
                    *[Dot(axes.c2p(x, 0.8 * x + 0.5 + (-1)**x * 0.3)) for x in range(1, 6)]
                )
                line = axes.plot(lambda x: 0.8 * x + 0.5, color=RED)

                self.play(Create(axes))
                self.play(FadeIn(points))
                self.play(Create(line))

            # ---- Loss Function ----
            elif visual == "loss_curve":
                axes = Axes(
                    x_range=[0, 6],
                    y_range=[0, 6],
                    x_length=6,
                    y_length=3
                ).shift(visual_origin)

                curve = axes.plot(lambda x: (x - 3)**2 / 2, color=BLUE)
                dot = Dot(axes.c2p(1, (1 - 3)**2 / 2), color=RED)

                self.play(Create(axes), Create(curve))
                self.play(FadeIn(dot))

            # ---- Gradient Descent ----
            elif visual == "gradient_descent":
                axes = Axes(
                    x_range=[0, 6],
                    y_range=[0, 6],
                    x_length=6,
                    y_length=3
                ).shift(visual_origin)

                curve = axes.plot(lambda x: (x - 3)**2 / 2, color=BLUE)
                dot = Dot(axes.c2p(5, (5 - 3)**2 / 2), color=RED)

                self.play(Create(axes), Create(curve))
                self.play(FadeIn(dot))

                for x in [4, 3.2, 3.05]:
                    self.play(
                        dot.animate.move_to(
                            axes.c2p(x, (x - 3)**2 / 2)
                        ),
                        run_time=0.8
                    )

            # ---- Neural Network ----
            elif visual == "neural_network":
                layers = [
                    VGroup(*[Circle(radius=0.2) for _ in range(n)])
                    for n in [3, 4, 2]
                ]
                network = VGroup(*layers).arrange(RIGHT, buff=1.5)
                network.shift(visual_origin)
                self.play(Create(network))

            # -------- HOLD --------
            self.wait(max(audio_time, 3))

            # -------- CLEANUP --------
            self.play(FadeOut(*self.mobjects))
