from abc import ABC, abstractmethod

class Prompt(ABC):

    @abstractmethod
    def invoker(self):
        pass

    @abstractmethod
    def prompt_generator(self, **kwargs):
        pass

    @abstractmethod
    def prompt_executor(self) -> str:
        pass