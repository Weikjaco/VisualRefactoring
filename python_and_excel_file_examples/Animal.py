class Animal:
    def __init__(self):
        self.breath_o2 = True
        self.move = True
        self.consume_organic_material = True

    def grow_from_cells(self):
        # Grow here
        pass


class Bobcat(Animal):
    def __init__(self, type_of):
        Animal.__init__(self)
        self.type = type_of

    def roar(self):
        print("Bobcat is roaring")


class Bear(Animal):
    def __init__(self, type_of):
        Animal.__init__(self)
        self.type = type_of

    def roar(self):
        print("Bear is roaring")


class Burger:
    def __init__(self, type_of_burger):
        self.type = type_of_burger

    def print_type(self):
        print("I am a " + str(self.type) + " burger.")


class Patty(Burger):
    def __init__(self, type_of_patty):
        self.type = type_of_patty

    def print_type(self):
        print("I am a " + str(self.type) + " patty.")