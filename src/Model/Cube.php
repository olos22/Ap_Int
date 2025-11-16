<?php
namespace App\Model;

use App\Service\Config;

class Cube
{
    private ?int $id = null;
    private ?string $type = null;
    private ?int $size = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Cube
    {
        $this->id = $id;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): Cube
    {
        $this->type = $type;

        return $this;
    }

    public function getSize(): ?int
    {
        return $this->size;
    }

    public function setSize(?int $size): Cube
    {
        $this->size = $size;

        return $this;
    }

    public static function fromArray($array): Cube
    {
        $cube = new self();
        $cube->fill($array);

        return $cube;
    }

    public function fill($array): Cube
    {
        if (isset($array['id']) && ! $this->getId())
        {
            $this->setId($array['id']);
        }
        if (isset($array['type']))
        {
            $this->setType($array['type']);
        }
        if (isset($array['size']))
        {
            $this->setSize($array['size']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM cube';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $cubes = [];
        $cubesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($cubesArray as $cubeArray)
        {
            $cubes[] = self::fromArray($cubeArray);
        }

        return $cubes;
    }

    public static function find($id): ?Cube
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM cube WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $cubeArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $cubeArray)
        {
            return null;
        }
        $cube = Cube::fromArray($cubeArray);

        return $cube;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId())
        {
            $sql = "INSERT INTO cube (type, size) VALUES (:type, :size)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'type' => $this->getType(),
                'size' => $this->getSize(),
            ]);

            $this->setId($pdo->lastInsertId());
        }
        else
        {
            $sql = "UPDATE cube SET type = :type, size = :size WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':type' => $this->getType(),
                ':size' => $this->getSize(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM cube WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setType(null);
        $this->setSize(null);
    }
}