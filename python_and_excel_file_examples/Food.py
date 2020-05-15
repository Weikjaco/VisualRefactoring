class Sandwich:
    def __init__(self, type_of_sandwich):
        self.type = type_of_sandwich

    def print_type(self):
        print("I am a " + str(self.type) + " sandwich.")


class Salad:
    def __init__(self, type_of_salad):
        self.type = type_of_salad

    def print_type(self):
        print("I am a " + str(self.type) + " salad.")
