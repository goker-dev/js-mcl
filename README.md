js-mcl
======

*JS-MCL : JavaScript Monte Carlo Localization Simulator*
--------------------------------------------------------

JS-MCL is a basic Monte Carlo Localization Simulator. 
It uses Monte Carlo methods to generate the probability distribution of possible 
locations. It has a UI and controls feature to test different probabilities. 

I developed this as my homework for **Probabilistic Robotic** course of M.Sc. 
Programme in Computer Engineering in Yildiz Technical University. http://www.bologna.yildiz.edu.tr/index.php?r=course/view&id=6900&aid=3


References
----------

It's simple *Python* version was developed by **Feynman Liang** as a response 
**Udacity** (www.udacity.com) **CS 373** course. 
https://github.com/feynmanliang/MonteCarloLocalization 
https://www.udacity.com/course/cs373


Usage
-----
**Map**: Map is created with colorful rectangles as a 2D matrix. 
Each rectangle has an index number on background and a probability bar 
(to show probability distribution) on its right side. 
Rectangles represent the first char of color name in controls section. 
You can use red, green, blue, yellow colors to generate a map.

**Robot**: Robot is blue and has an oval shape. You can move it on the map step 
by step with keyboard arrow buttons. Robot calculates probability distribution 
of possible locations after each movement. Also you can set default position 
of robot by X and Y in controls section.

**Movement Noise and Sensor Noise**: Sensor noise corrupt the accuracy of the 
sensor. Movement noise corrupt the probability that the robot will move vs 
stay in current position. They should be a number between 1 and 0. If you set 
0.5, the meaning measurements will be 50 percent correct.

**Kidnapped Robot Problem**: It is to simulate a situation where the robot 
in operation is carried to an arbitrary location. 
http://en.wikipedia.org/wiki/Kidnapped_robot_problem


License
-------
It is under [MIT License](https://github.com/gokercebeci/js-mcl/blob/master/LICENSE.md "MIT License") 


Developer
---------
[goker](http://gokercebeci.com/ "goker")