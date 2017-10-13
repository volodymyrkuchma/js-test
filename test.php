<?php
/*PATTERNS MVC*/
class Model {
    public $text;
    public function __construct() {
        $this->text = 'Hello world!';
    }
}
class View {
    private $model;
    public function __construct(Model $model) {
        $this->model = $model;
    }
    public function output() {
        return '<h1>' . $this->model->text .'</h1>';
    }
}
class Controller {
    private $model;
    public function __construct(Model $model) {
        $this->model = $model;
    }
}
//initiate the triad
$model = new Model();
//It is important that the controller and the view share the model
$controller = new Controller($model);
$view = new View($model);
echo $view->output();




/*Pattern Factory*/
class Admin {
    protected $addAdmins = true;
    protected $addModerators = true;
    protected $addPosts = true;
    protected $addComments = true;
}
class Moder {
    protected $addAdmins = false;
    protected $addModerators = false;
    protected $addPosts = true;
    protected $addComments = true;
}
class User {
    protected $addAdmins = false;
    protected $addModerators = false;
    protected $addPosts = false;
    protected $addComments = true;
}
$role = 'Admin';
class Factory {
    public static function createUsers($role) {
        if(class_exists($role))
            return new $role;
        else
            throw new Exception("Role $role not exist");
    }
}
$login = Factory::createUsers($role);
var_dump($login);




/*PATTERNS DECORATOR*/
class Hello {
    public function type() {
        return "Hello";
    }
}
class Decorator {
    protected $object;
    public function __construct($obj)
    {
        $this->object = $obj;
    }
    protected function getObject() {
        return $this->object;
    }
    public function type() {
        return $this->getObject()->type();
    }
}
class AddWorld extends Decorator {
    public function type() {
       return parent::type()." World";
    }
}
class AddStrong extends Decorator {
    public function type() {
        return "<strong>".parent::type()."</strong>";
    }
}
$hello = new Hello();
$addStrong = new AddStrong($hello);
$addWorld = new AddWorld($addStrong);

echo $addStrong->type();
echo "<br />";
echo $addWorld->type();


/*PATTERNS SINGLETON*/
class Singleton {
    private static $instance;
    protected $config = "admin";
    public function showConfig() {
        echo $this->config;
    }
    public function getInstance() {
        if (self::$instance === null) {
                self::$instance = new Singleton;
            }
        return self::$instance;
    }
    private function __construct() {}
    private function __clone() {}
    private function __wakeup() {}
}
Singleton::getInstance()->showConfig();



/*compare Arrays*/
$arr = [4, 1, 6, 'yes', 2, 11, 7];
$arr2 = [4, 1, 6, 'yes', 2, 11, 7];
function compareArrays($a, $b) {
    $aLen = count($a);
    $bLen = count($b);
    if ($aLen !== $bLen)
        return false;
    for ($i = 0; $i < $aLen; $i++) {
        if ($a[$i] !== $b[$i])
            return false;
    }
    return true;
}
$result = compareArrays($arr,$arr2);
echo $result ? 'the same' : 'differents';


/*Bubble Sort*/
$arr = [4, 5, 6, 3, 2, 11, 7];
$l = count($arr) - 1;
for ($i = 0; $i < $l; $i++) {
    for ($j = 0; $j < $l-$i; $j++) {
        if ($arr[$j+1] < $arr[$j]) {
            $t = $arr[$j+1];
            $arr[$j+1] = $arr[$j];
            $arr[$j] = $t;
        }
    }
}
print_r($arr);






/*private and __get _set*/
class GetSet
{
    private $number = 1;

    public function __get($name)
    {
        echo "You get {$this -> number}";
    }
    public function __set($name,$val)
    {
        echo "You set $val to $name";
    }
}

$obj = new GetSet();
echo $obj -> number;
echo "<br />";
echo $obj -> number = 7;




/* 3 children task*/
$arr1 = [];
for ($i = 1 ; $i < 29; $i++) {
    for ($j = 1; $j < 29; $j++) {
        if ($j>$i) break;
        for ($k = 1; $k < 29; $k++) {
            if ($k>$j) break;
            $m = $i*$j*$k;
            $s = $i+$j+$k;
            if ($m > 18 && $m < 47 && $s < 32) {
                $index = intval($s.$m);
                if (!$arr1[$index])
                    $arr1[$index] = "$i, $j, $k";
                else
                    echo "<p> $arr1[$index] | $i, $j, $k </p>";
            }
        }
    }
}
echo '<pre>'; print_r($arr1); echo '</pre>';